import React, { useEffect, useState } from "react";
import { Label } from "reactstrap";
import { Edit } from "react-feather";
import { selectThemeColors } from "@utils";
// ** Third Party Components
import Select from "react-select";

// const data = allTrial
// ** Third Party Components
import { Archive, ChevronDown, MoreVertical, Trash2 } from "react-feather";
import DataTable from "react-data-table-component";

// ** Reactstrap Imports
import { Button, Card, CardHeader, CardTitle } from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { getTrialsData } from "./steps/SocialLinks";
import { getSingleService } from "../../../../api/service";
const DataTablesBasic = ({ type, active, formData, actionType }) => {
  const [newTrialModal, setNewTrialModal] = useState(false);
  const [editTrialModal, setEditTrialModal] = useState(false);
  const [serviceTrials, setServiceTrials] = useState([]);
  const [allTrial, setAllTrial] = useState([]);
  const [trials, setTrials] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [selectTrial, setSelectTrial] = useState({});
  const [selectRole, setSelectRole] = useState({});
  const [editTrials, setEditTrials] = useState({});
  const [updateTrials, setUpdateTrials] = useState({});
  const [updateRole, setUpdateRole] = useState({});
  const [editTrialIndex, setEditTrialIndex] = useState();
  const [editRoleIndex, setEditRoleIndex] = useState({});
  const [trialOptions, setTrialOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [error, setError] = useState({ trial: false, role: false });
  let existTrial = false;
  const getTrialsAndRoles = async () => {
    if (type !== undefined) {
      let services = await getSingleService(type);
      await setTrials(services.data.trials);
      await setAllRoles(services.data.roles);
      await getCustomData(services.data.trials, services.data.roles);
    }
  };

  useEffect(() => {
    setTrialOptions(
      trials.map((val) => ({
        value: val.id,
        label: val.name,
      }))
    );
  }, [trials]);

  useEffect(() => {
    setRoleOptions(
      allRoles.map((val) => ({
        value: val.id,
        label: val.name,
      }))
    );
  }, [allRoles]);
  function validateTrialValue() {
    if (selectTrial.val) {
      setError((data) => ({ ...data, trial: false }));
    } else {
      setError((data) => ({ ...data, trial: true }));
    }
    if (selectRole.val) {
      setError((data) => ({ ...data, role: false }));
    } else {
      setError((data) => ({ ...data, role: true }));
    }
  }

  function validateTrial() {
    for (let i = 0; i < serviceTrials.length; i++) {
      if (serviceTrials[i].trialId == selectTrial.val) {
        existTrial = true;
        return existTrial;
      } else {
        existTrial = false;
      }
    }
    return existTrial;
  }
  function validateTrialAtUpdate() {
    for (let i = 0; i < serviceTrials.length; i++) {
      if (serviceTrials[i].trialId == updateTrials.val) {
        existTrial = true;
        return existTrial;
      } else {
        existTrial = false;
      }
    }
    return existTrial;
  }

  const addNewTrial = async () => {
    validateTrialValue();
    if (selectTrial.val && selectRole.val) {
      setError((data) => ({ ...data, trial: false, role: false }));

      if (!validateTrial()) {
        setAllTrial([
          ...allTrial,
          { trial_id: selectTrial.val, role_id: selectRole.val },
        ]);
        setServiceTrials([
          ...serviceTrials,
          {
            trialName: selectTrial.label,
            role: selectRole.label,
            trialId: selectTrial.val,
            roleId: selectRole.val,
          },
        ]);
      }
      setNewTrialModal(!newTrialModal);
      setSelectRole({ label: "", val: "" });
      setSelectTrial({ label: "", val: "" });
    }
  };

  const deleteTrial = (index) => {
    setServiceTrials(
      serviceTrials.filter((trial) => trial !== serviceTrials[index])
    );
    setAllTrial(allTrial.filter((trial) => trial !== allTrial[index]));
  };
  const editTrial = async (data) => {
    await getTrialsAndRoles();
    setEditTrials({ trialId: data.trialId, roleId: data.roleId });
    setEditTrialIndex(data.trialId);
    setEditRoleIndex(data.roleId);
    setEditTrialModal(!editTrialModal);
  };
  const updateTrial = () => {
    let updateIndex = serviceTrials.findIndex(
      (data) =>
        data.trialId == editTrials.trialId && data.roleId == editTrials.roleId
    );
    let newArr = [...serviceTrials];
    
    if (
      Object.keys(updateTrials).length > 0 &&
      Object.keys(updateRole).length <= 0
    ) {
      newArr[updateIndex] = {
        ...newArr[updateIndex],
        trialName: updateTrials.label,
        trialId: updateTrials.val,
      };
      setServiceTrials(newArr);
      setUpdateTrials({});
    } else if (
      Object.keys(updateRole).length > 0 &&
      Object.keys(updateTrials).length <= 0
    ) {
      newArr[updateIndex] = {
        ...newArr[updateIndex],
        role: updateRole.label,
        roleId: updateRole.val,
      };
      setServiceTrials(newArr);
      setUpdateRole({});
    } else if (
      Object.keys(updateTrials).length > 0 &&
      Object.keys(updateRole).length > 0
    ) {
      newArr[updateIndex] = {
        trialName: updateTrials.label,
        role: updateRole.label,
        trialId: updateTrials.val,
        roleId: updateRole.val,
      };
      setServiceTrials(newArr);
      setUpdateTrials({});
      setUpdateRole({})
    } else {
      setUpdateTrials({});
      setUpdateRole({})
    }

  };
  useEffect(() => {
    if (
      formData.service_trials !== undefined &&
      formData.service_trials.length > 0
    )
      getActionMounted();
  }, [formData]);

  const getActionMounted = async () => {
    await getTrialsAndRoles();
  };

  const getCustomData = async (trialsAttr, rolesAttr) => {
    if (actionType === "edit" && serviceTrials.length === 0) {
      for (let index = 0; index < formData.service_trials.length; index++) {
        const element = formData.service_trials[index];
        if (element.service_id === type) {
          let customTrials = await Promise.all(
            element.trials.map(async function (val) {
              let trialData = await trialsAttr.filter(function (itm) {
                return itm.id == val.trial_id;
              });
              let roleData = await rolesAttr.filter(function (itm) {
                return itm.id == val.role_id;
              });
              return {
                trialName: trialData[0] !== undefined ? trialData[0].name : "",
                role: roleData[0] !== undefined ? roleData[0].name : "",
                trialId: trialData[0] !== undefined ? trialData[0].id : "",
                roleId: roleData[0] !== undefined ? roleData[0].id : "",
              };
            })
          );
          let customTrialsAll = await Promise.all(
            element.trials.map(async function (val) {
              let trialData = await trialsAttr.filter(function (itm) {
                return itm.id == val.trial_id;
              });
              let roleData = await rolesAttr.filter(function (itm) {
                return itm.id == val.role_id;
              });
              return {
                trial_id: trialData[0] !== undefined ? trialData[0].id : "",
                role_id: roleData[0] !== undefined ? roleData[0].id : "",
              };
            })
          );
          setAllTrial(customTrialsAll);
          setServiceTrials(customTrials);
          break;
        }
      }
    }
  };
  useEffect(() => {
    getTrialsData({ allTrial, type });
  }, [serviceTrials, allTrial]);

  const basicColumns = [
    {
      name: "Trial Name",
      sortable: true,
      minWidth: "200px",
      selector: (row) => row.trialName,
    },
    {
      name: "Role",
      sortable: true,
      minWidth: "100px",
      selector: (row) => row.role,
    },
    {
      name: "Assign Site",
      sortable: true,
      minWidth: "200px",
      selector: (row) => row.assignSite,
    },
    {
      name: "Actions",
      minWidth: "100px",
      cell: (row, index) => (
        <div className="column-action">
          <Trash2
            color="red"
            size={16}
            className="me-50 cursor-pointer"
            onClick={() => deleteTrial(index)}
          />
          <Edit
            size={16}
            className="me-50 cursor-pointer"
            onClick={() =>
              editTrial({ trialId: row.trialId, roleId: row.roleId })
            }
          />
        </div>
      ),
    },
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="add-new-trial">
        <CardTitle tag="h4">
          <Button
            className="add-new-user add-new-trial"
            color="primary"
            outline
            onClick={() => {
              setNewTrialModal(!newTrialModal);
              getTrialsAndRoles();
            }}
          >
            Add New Trial
          </Button>
        </CardTitle>
      </CardHeader>

      <Modal
        isOpen={editTrialModal}
        toggle={() => setEditTrialModal(!editTrialModal)}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={() => setEditTrialModal(!editTrialModal)}>
          Edit Trial
        </ModalHeader>
        <ModalBody>
          <Label className="form-label" for={`timezone-${type}`}>
            Select Trial{" "}
            <span style={{ color: "crimson", fontWeight: "700" }}>*</span>
          </Label>
          {trialOptions.length > 0 ? (
            <Select
              isClearable={false}
              theme={selectThemeColors}
              id={`trial-${type}`}
              options={trialOptions}
              className="react-select"
              classNamePrefix="select"
              defaultValue={trialOptions.filter(
                ({ value }) => value == editTrialIndex
              )}
              onChange={(e) => {
                setUpdateTrials({ label: e?.label, val: e?.value });
              }}
            />
          ) : (
            ""
          )}
          <Label className="form-label" for={`timezone-${type}`}>
            Select Role{" "}
            <span style={{ color: "crimson", fontWeight: "700" }}>*</span>
          </Label>
          <Select
            isClearable={false}
            theme={selectThemeColors}
            id={`trial-${type}`}
            options={roleOptions}
            className="react-select"
            classNamePrefix="select"
            defaultValue={roleOptions.filter(
              (value) => value.value === editRoleIndex
            )}
            onChange={(e) => {
              setUpdateRole({ label: e?.label, val: e?.value });
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            className="modal-center-btn"
            color="primary"
            onClick={() => {
              setEditTrialModal(!editTrialModal);
              updateTrial();
            }}
          >
            Update Trial
          </Button>
        </ModalFooter>
      </Modal>

      <Modal
        isOpen={newTrialModal}
        toggle={() => setNewTrialModal(!newTrialModal)}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={() => setNewTrialModal(!newTrialModal)}>
          Add New Trial
        </ModalHeader>
        <ModalBody>
          <Label className="form-label" for={`timezone-${type}`}>
            Select Trial{" "}
            <span style={{ color: "crimson", fontWeight: "700" }}>*</span>
          </Label>
          <Select
            isClearable={false}
            theme={selectThemeColors}
            id={`trial-${type}`}
            options={trialOptions}
            className={`react-select ${
              error.trial ? "is-invalid" : "is-valid"
            }`}
            classNamePrefix="select"
            onChange={(e) => {
              setSelectTrial({ label: e?.label, val: e?.value });
            }}
          />
          <Label className="form-label" for={`timezone-${type}`}>
            Select Role{" "}
            <span style={{ color: "crimson", fontWeight: "700" }}>*</span>
          </Label>
          <Select
            isClearable={false}
            theme={selectThemeColors}
            id={`trial-${type}`}
            options={roleOptions}
            className={`react-select ${error.role ? "is-invalid" : "is-valid"}`}
            classNamePrefix="select"
            onChange={(e) => {
              setSelectRole({ label: e?.label, val: e?.value });
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            className="modal-center-btn"
            color="primary"
            onClick={() => {
              addNewTrial();
            }}
          >
            Add
          </Button>
        </ModalFooter>
      </Modal>
      <div className="react-dataTable">
        <DataTable
          noHeader
          // pagination
          data={serviceTrials}
          columns={basicColumns}
          className="react-dataTable"
          sortIcon={<ChevronDown size={10} />}
          paginationRowsPerPageOptions={[10, 25, 50, 100]}
        />
      </div>
    </Card>
  );
};

export default DataTablesBasic;
