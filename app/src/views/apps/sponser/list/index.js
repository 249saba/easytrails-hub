
// ** React Imports
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-hot-toast";
// ** Styles
import "@styles/react/apps/app-users.scss";
import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Input,
  Label,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Badge,
  UncontrolledTooltip,
} from "reactstrap";
// ** Icons Imports
import { Edit, XCircle, CheckCircle, ChevronDown } from "react-feather";

import { getAllService } from "../../../../api/service";

import { useDispatch, useSelector } from "react-redux";
import { getData } from "../store";
// ** Third Party Components
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import { changeSponsorStatus, createSponsor, updateSponsor } from "../../../../api/sponsor";
import { actionModal } from "../../../components/custom modals/ActionModal";
const CustomHeader = ({
  store,
  handlePerPage,
  rowsPerPage,
  handleFilter,
  searchTerm,
}) => {
  const [centeredModal, setCenteredModal] = useState(false);
  const [sponsorName, setSponsorName] = useState("");
  const [sponserValidate, setSponserValidate] = useState("");
  const navigate = useNavigate();
  // ** Converts table to CSV
  function convertArrayOfObjectsToCSV(array) {
    let result;

    const columnDelimiter = ",";
    const lineDelimiter = "\n";
    const keys = Object.keys(store.data[0]);

    result = "";
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    array.forEach((item) => {
      let ctr = 0;
      keys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter;

        result += item[key];

        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  }

  const handleSubmit = async () => {
    if (sponsorName.length > 0) {
      const res = await createSponsor(sponsorName);
      setSponserValidate("is-valid");
      if (res.success) {
        toast.success(res.message);
        setCenteredModal(!centeredModal);
        setSponsorName("");
      } else {
        toast.error(res.message);
        setSponsorName("");
      }
    } else {
      setSponserValidate("is-invalid");
    }
    navigate("/apps/sponsor/list");
  };
  useEffect(() => {
    getData(rowsPerPage);
  }, [rowsPerPage]);
  return (
    <div className="invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75">
      <Row>
        <Col xl="6" className="d-flex align-items-center p-0">
          <div className="d-flex align-items-center w-100">
            <label htmlFor="rows-per-page">Show</label>
            <Input
              className="mx-50"
              type="select"
              id="rows-per-page"
              value={rowsPerPage}
              onChange={handlePerPage}
              style={{ width: "5rem" }}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </Input>
            <label htmlFor="rows-per-page">Entries</label>
          </div>
        </Col>
        <Col
          xl="6"
          className="d-flex align-items-sm-center justify-content-xl-end justify-content-start flex-xl-nowrap flex-wrap flex-sm-row flex-column pe-xl-1 p-0 mt-xl-0 mt-1"
        >
          <div className="d-flex align-items-center mb-sm-0 mb-1 me-1">
            <label className="mb-0" htmlFor="search-invoice">
              Search:
            </label>
            <Input
              id="search-invoice"
              className="ms-50 w-100"
              type="text"
              value={searchTerm}
              onChange={(e) => handleFilter(e.target.value)}
            />
          </div>

          <div className="d-flex align-items-center table-header-actions vertically-centered-modal">
            <Button
              className="add-new-sponsor orange-bg orange-border"
              color="primary"
              onClick={() => setCenteredModal(!centeredModal)}
            >
              Add New Sponsor
            </Button>
          </div>
          <Modal
            isOpen={centeredModal}
            toggle={() => setCenteredModal(!centeredModal)}
            className="modal-dialog-centered"
          >
            <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>
              Add New Sponsor
            </ModalHeader>
            <ModalBody>
              <div className="mb-1">
                <Label className="form-label" for="new-password">
                  Sponsor Name <span style={{color:"crimson",fontWeight:"700"}}>*</span>
                </Label>
                <Input
                  className={`input-group-merge ${sponserValidate}`}
                  id="sponser-name"
                  onChange={(e) => setSponsorName(e.target.value)}
                  value={sponsorName}
                  placeholder="Enter a Sponsor name"
                  autoFocus
                />
              </div>
            </ModalBody>
            <ModalFooter className="d-flex align-items-center justify-content-center">
              <Button className="orange-bg orange-border" onClick={handleSubmit}>
                Submit
              </Button>
              <Button
                color="white"
                onClick={() => setCenteredModal(!centeredModal)}
              >
                cancel
              </Button>
            </ModalFooter>
          </Modal>
        </Col>
      </Row>
    </div>
  );
};

const SponsorList = () => {
  // ** Store Vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.users);

  // ** States
  const [sort, setSort] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("id");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentService, setCurrentService] = useState({
    id: "",
    label: "Select Service",
  });
  const [currentStatus, setCurrentStatus] = useState({
    value: "all",
    label: "All",
  });

  const [serviceOption, setServiceOption] = useState([]);
  const MySwal = withReactContent(Swal);
  const statusObj = {
    1: "light-success",
    0: "light-danger",
  };

  const columns = [
    {
      name: "Id",
      sortable: true,
      minWidth: "100px",
      sortField: "id",
      selector: (row) => row.id,
      cell: (row) => (
        <div className="d-flex justify-content-left align-items-center">
          {row.id}
        </div>
      ),
    },
    {
      name: "Sponsor Name",
      sortable: true,
      minWidth: "172px",
      sortField: "name",
      selector: (row) => row.name,
    },
    {
      name: "Sponsor Total Trial",
      minWidth: "138px",
      sortable: true,
      sortField: "trials_count",
      selector: (row) => row.trials_count,
      cell: (row) => row.trials_count,
    },
    {
      name: "Status",
      minWidth: "138px",
      sortable: true,
      sortField: "active",
      selector: (row) => row.active,
      cell: (row) => (
        <Badge className="text-capitalize new-custom-badge-for-active-deactive" color={statusObj[row.active]} pill>
          {row.active ? "Active" : "Deactive"}
        </Badge>
      ),
    },
    {
      name: "Actions",
      minWidth: "100px",
      cell: (row) => {
        const [editSponsorModal, setEditSponsorModal] = useState(false);
        const [editSponsorName, setEditSponsorName] = useState("");
        const [editSponsorValidate, setEditSponsorValidate] = useState("");
        const navigate = useNavigate();
        const changeStatusOfSponsor = async (sponsorid, status) => {
          let res = await actionModal({
            title: "Are You sure?",
            icon: "warning",
            text: `You want to ${status} this Sponsor?`,
            confirmText: `Yes ${status} Sponsor`,
          });
          if (res == true) {
            let statusFormatted = status == "Activate" ? "active" : "inactive";
            let res = await changeSponsorStatus(sponsorid, statusFormatted);
            if (res.success) {
              toast.success(res.message);
              
              
              dispatch(
                getData({
                  sort,
                  sortColumn,
                  q: searchTerm,
                  page: currentPage,
                  perPage: rowsPerPage,
                  service_id: currentService.id,
                  status: currentStatus.value,
                }));

            } else {
              toast.error(res.message);
            }
          }
         
        };
        const editSponsor = (sponsorData) => {
          setEditSponsorName(sponsorData.name);
        };
        const handleSubmit = async (userid) => {
          if (editSponsorName.length > 0) {
            const res = await updateSponsor(userid, editSponsorName);
            setEditSponsorValidate("is-valid");
            if (res.success) {
              toast.success(res.message);
              setEditSponsorModal(!editSponsorModal);
              setEditSponsorName("");
              navigate("/apps/sponsor/list");
              setEditSponsorValidate("");
            } else {
              toast.error(res.message);
            }
          } else {
            setEditSponsorValidate("is-invalid");
          }
        };
        return (
          <div className="column-action">
            <div className="d-flex">
              <div
                className="icon-1"
                id={`editIcon${row.id}`}
                onClick={() => {
                  setEditSponsorModal(!editSponsorModal);
                  editSponsor(row);
                }}
              >
                <Edit size={20} />
                <UncontrolledTooltip placement='auto' target={`editIcon${row.id}`}>
                Edit 
              </UncontrolledTooltip>
              </div>

              {row.active == "0" ? (
                <div
                  className="icon-1 green-icon-1"
                  id={`activateIcon${row.id}`}
                  onClick={() => {
                    changeStatusOfSponsor(row.id, "Activate");
                  }}
                >
                  <CheckCircle size={20} />
                  <UncontrolledTooltip placement='auto' target={`activateIcon${row.id}`}>
                Activate 
              </UncontrolledTooltip>
                </div>
              ) : (
                <div
                  className="icon-1 "
                  id={`deactivateIcon${row.id}`}
                  
                  onClick={() => {
                    changeStatusOfSponsor(row.id, "Deactivate");
                  }}
                >
                  <XCircle size={20} />
                <UncontrolledTooltip placement='auto' target={`deactivateIcon${row.id}`}>
                Deactivate 
              </UncontrolledTooltip>
                </div>
              )}
            </div>
            <Modal
              isOpen={editSponsorModal}
              toggle={() => setEditSponsorModal(!editSponsorModal)}
              className="modal-dialog-centered"
            >
              <ModalHeader
                toggle={() => setEditSponsorModal(!editSponsorModal)}
              >
                Edit Sponsor
              </ModalHeader>
              <ModalBody>
                <div className="mb-1">
                  <Label className="form-label" for="new-password">
                    Sponsor Name <span style={{color:"crimson",fontWeight:"700"}}>*</span>
                  </Label>
                  <Input
                    className={`input-group-merge ${editSponsorValidate}`}
                    id="sponser-name"
                    onChange={(e) => setEditSponsorName(e.target.value)}
                    value={editSponsorName}
                    placeholder="edit a Sponsor name"
                    autoFocus
                  />
                </div>
              </ModalBody>
              <ModalFooter className="d-flex align-items-center justify-content-center">
                <Button color="primary" onClick={() => handleSubmit(row.id)}>
                  Submit
                </Button>
                <Button
                  color="white"
                  onClick={() => setEditSponsorModal(!editSponsorModal)}
                >
                  cancel
                </Button>
              </ModalFooter>
            </Modal>
          </div>
        );
      },
    },
  ];

  // ** Get data on mount
  useEffect(() => {
    dispatch(
      getData({
        sort,
        sortColumn,
        q: searchTerm,
        page: currentPage,
        perPage: rowsPerPage,
        service_id: currentService.id,
        status: currentStatus.value,
      })
    );
  }, [dispatch, store.data.length, sort, sortColumn, currentPage]);

  useEffect(() => {
    getMountedData();
  }, []);

  const getMountedData = async () => {
    let services = await getAllService();

    setServiceOption(services.data);
  };

  // ** Function in get data on page change
  const handlePagination = (page) => {
    dispatch(
      getData({
        sort,
        sortColumn,
        q: searchTerm,
        perPage: rowsPerPage,
        page: page.selected + 1,
        service_id: currentService.id,
        status: currentStatus.value,
      })
    );
    setCurrentPage(page.selected + 1);
  };

  // ** Function in get data on rows per page
  const handlePerPage = (e) => {
    const value = parseInt(e.currentTarget.value);
    dispatch(
      getData({
        sort,
        sortColumn,
        q: searchTerm,
        perPage: value,
        page: currentPage,
        service_id: currentService.id,
        status: currentStatus.value,
      })
    );
    setRowsPerPage(value);
  };

  // ** Function in get data on search query change
  const handleFilter = (val) => {
    setSearchTerm(val);
    dispatch(
      getData({
        sort,
        q: val,
        sortColumn,
        page: currentPage,
        perPage: rowsPerPage,
        service_id: currentService.id,
        status: currentStatus.value,
      })
    );
  };

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Number(Math.ceil(store.total / rowsPerPage));

    return (
      <ReactPaginate
        previousLabel={""}
        nextLabel={""}
        pageCount={count || 1}
        activeClassName="active"
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={(page) => handlePagination(page)}
        pageClassName={"page-item"}
        nextLinkClassName={"page-link"}
        nextClassName={"page-item next"}
        previousClassName={"page-item prev"}
        previousLinkClassName={"page-link"}
        pageLinkClassName={"page-link"}
        containerClassName={
          "pagination react-paginate justify-content-end my-2 pe-1"
        }
      />
    );
  };

  // ** Table data to render
  const dataToRender = () => {
    const filters = {
      service_id: currentService.id,
      status: currentStatus.value,
      q: searchTerm,
    };

    const isFiltered = Object.keys(filters).some(function (k) {
      return filters[k].length > 0;
    });

    if (store.data.length > 0) {
      return store.data;
    } else if (store.data.length === 0 && isFiltered) {
      return [];
    } else {
      return store.allData.slice(0, rowsPerPage);
    }
  };

  const handleSort = (column, sortDirection) => {
    setSort(sortDirection);
    setSortColumn(column.sortField);
    dispatch(
      getData({
        sort,
        sortColumn,
        q: searchTerm,
        page: currentPage,
        perPage: rowsPerPage,
        service_id: currentService.id,
        status: currentStatus.value,
      })
    );
  };

  const selectAllOption = [{ id: 0, name: "Select All" }];
  return (
    <Card className="overflow-hidden">
      <div className="react-dataTable">
        <DataTable
          noHeader
          subHeader
          sortServer
          pagination
          responsive
          paginationServer
          columns={columns}
          onSort={handleSort}
          sortIcon={<ChevronDown />}
          className="react-dataTable"
          paginationComponent={CustomPagination}
          data={dataToRender()}
          subHeaderComponent={
            <CustomHeader
              store={store}
              searchTerm={searchTerm}
              rowsPerPage={rowsPerPage}
              handleFilter={handleFilter}
              handlePerPage={handlePerPage}
            />
          }
        />
      </div>
    </Card>
  );
};

export default SponsorList;
