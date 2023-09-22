import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import toast from "react-hot-toast";
import { getPermissions, postRoles, updateRole } from "../../../../api/role";
import "../../../../@core/components/rolestyle/index.scss";
import { useForm, useWatch } from "react-hook-form";
import { Spinner } from "reactstrap";

function AddRole({
  handleModal,
  addModal,
  modalheading,
  service,
  roleData,
  role_id,
}) {
  const [isLoading, setIsLoading] = useState(false);
  
  const [permissionList, setPermissionList] = useState([]);
  const [formApiValue, setformApiValue] = useState({
    name: "",
    service_id: service,
    permissions: [],
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    defaultValues: { modalRoleName: roleData?.name, RolePermission: "" },
  });

  useEffect(() => {
    getPermission();
  }, []);

  useEffect(() => {
    setformApiValue({
      name: roleData?.name,
      service_id: service,
      permissions: roleData?.permissions.map((permission) => {
        return { id: permission.id };
      }),
    });
  }, [roleData]);
  const getPermission = async () => {
    let data = await getPermissions();
    setPermissionList(data.data);
  };

  const postRoleApi = async (data) => {
    console.log(data)
    let result = await postRoles({ ...formApiValue,name:data?.modalRoleName });
    setIsLoading(false);

    if (result.success) {
      handleModal();
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };
  const updateRoleApi = async (data) => {
   
    let result = await updateRole(role_id, { ...formApiValue,name:data?.modalRoleName });
    setIsLoading(false);

    if (result.success) {
      handleModal();
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };
  const handleCheckbox = (event, id) => {
    let _permissions = formApiValue?.permissions ?? [];

    let _index = _permissions.findIndex((item) => item.id === id);
    if (_index > -1) {
      _permissions.splice(_index, 1);
    } else {
      _permissions.push({ id: id });
    }
    setformApiValue({
      ...formApiValue,
      permissions: _permissions,
    });
  };
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setformApiValue({
        ...formApiValue,
        permissions: permissionList?.map((item) => {
          return { id: item.id };
        }),
      });
    } else if (!event.target.checked) {
      setformApiValue({
        ...formApiValue,
        permissions: [],
      });
    }
  };

  return (
    <Modal
      isOpen={addModal || editModal}
      toggle={() => handleModal()}
      className="modal-dialog modal-lg modal-dialog-centered "
    >
      <ModalHeader toggle={() => handleModal()}></ModalHeader>

      <ModalBody className="role-modal">
        <div className="text-center">
          <h3 className="role-title mb-2">{modalheading}</h3>
        </div>
        <form
          id="addRoleForm"
          className="row g-3"
          onSubmit={handleSubmit((data) => {
            setIsLoading(true);
            if (modalheading == "Add New Role") {
              postRoleApi(data);
            } else if (modalheading == "Edit Role") {
              updateRoleApi(data);
            }
          })}
        >
          <div className="col-12">
            <label className="form-label" htmlFor="modalRoleName">
              Role Name
            </label>
            <input
              type="text"
              id="modalRoleName"
              name="modalRoleName"
              className="form-control"
              placeholder="Enter a role name"
              // onChange={handleChange}
              // value={formApiValue?.name || roleData?.name}
              {...register("modalRoleName", {
                required: "Role name is required",
              })}
            />
            <p className="error">{errors.modalRoleName?.message}</p>
          </div>
          <div className="col-12 role-h5">
            <h5 className="role-permission-heading ">Role Permissions</h5>

            <div className="table-responsive">
              <table className="role-table table table-flush-spacing">
                <tbody>
                  <tr>
                    <td className="text-nowrap ">
                      <i
                        className="ti ti-info-circle"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Allows a full access to the system"
                      ></i>
                    </td>
                    <td>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="selectAll"
                          onChange={(e) => handleSelectAll(e)}
                          checked={
                            permissionList?.length ==
                            formApiValue?.permissions?.length
                          }
                        />
                        <label className="form-check-label" htmlFor="selectAll">
                          {" "}
                          Select All{" "}
                        </label>
                      </div>
                    </td>
                  </tr>
                  {permissionList?.length > 0 &&
                    permissionList?.map((item, index) => (
                      <tr key={index}>
                        <td className="text-nowrap ">
                          {item.name}
                          <i
                            className="ti ti-info-circle"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                          ></i>
                        </td>

                        <td>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={item.id}
                              {...register("RolePermission", {
                                required: {
                                  value: true,
                                  message:
                                    "Please select at least one permission",
                                },
                              })}
                              checked={formApiValue?.permissions?.some(
                                (permission) => permission.id == item?.id
                              )}
                              onChange={(e) => {
                                handleCheckbox(e, item.id);
                              }}
                            />

                            <label
                              className="form-check-label"
                              htmlFor={item.id}
                            >
                              {" "}
                            </label>
                          </div>
                        </td>
                      </tr>
                    ))}
                  <p className="error">{errors.RolePermission?.message}</p>
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-12 text-center mt-4">
            <button
              type="submit"
              className="btn btn-primary me-sm-3 me-1"
              disabled={isLoading}
            >
              {isLoading ? <Spinner size={"sm"} /> : "Submit"}
            </button>
            <button
              type="reset"
              className="btn btn-label-secondary"
              data-dismiss="modal"
              aria-label="Close"
              onClick={() => handleModal()}
            >
              Cancel
            </button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
}

export default AddRole;
