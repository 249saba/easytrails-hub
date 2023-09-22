// ** React Imports
import React, { Fragment, useState, useEffect } from "react";
// ** Invoice List Sidebar
// import Sidebar from "./Sidebar";

// ** Store & Actions
import { getData } from "../store/index";
import { useDispatch, useSelector } from "react-redux";

// ** Third Party Components
import Select from "react-select";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import {
  ChevronDown,
  Share,
  Printer,
  FileText,
  File,
  Grid,
  Copy,
  Edit,
  CheckCircle,
  Mail,
  XCircle,
  Trash,
} from "react-feather";

// ** Utils
import { selectThemeColors } from "@utils";

import { getAllService } from "../../../../api/service";
// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Input,
  Label,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  UncontrolledTooltip,
  Badge,
} from "reactstrap";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { Link, useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { actionModal } from "../../../components/custom modals/ActionModal";
import {
  changeStatus,
  deactivateUser,
  exportUsers,
  reInviteUser,
} from "../../../../api/user";
import { toast } from "react-hot-toast";
import Avatar from "@components/avatar";
import fileDownload from "js-file-download";

// ** Renders Client Columns
const renderClient = (row) => {
  return (
    <Avatar
      initials
      className="me-1"
      color={row.avatarColor || "light-primary"}
      content={row.name || "John Doe"}
    />
  );
};

// ** Renders Role Columns
const renderService = (row) => {
  return row.services_count;
};

const MySwal = withReactContent(Swal);
const statusObj = {
  "never-logged-in": "light-warning",
  active: "light-success",
  inactive: "light-danger",
  invited: "light-primary",
};

// ** Table Header
const CustomHeader = ({
  store,
  handlePerPage,
  rowsPerPage,
  handleFilter,
  searchTerm,
}) => {
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

  // ** Downloads CSV
  function downloadCSV(array) {
    const link = document.createElement("a");
    let csv = convertArrayOfObjectsToCSV(array);
    if (csv === null) return;

    const filename = "export.csv";

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", filename);
    link.click();
  }
  var monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const exportFile = async (fileType, file) => {
    let date = new Date();
    let hour = date.getHours();
    let min = date.getMinutes();
    let day = `${date.getDate()}-${
      monthNames[date.getMonth()]
    }-${date.getFullYear()}`;
    let hours = `${
      hour > 12 ? (hour - 12 < 10 ? "0" + (hour - 12) : hour - 12) : "0" + hour
    }`;
    let minutes = `${min < 10 ? "0" + min : min}`;
    let ampm = hour <= 12 ? "AM" : "PM";
    let currentDate = `${day}-${hours}-${minutes}-${ampm}`;

    let res = await exportUsers({ type: fileType });
    if (file == "copy") {
      navigator.clipboard
        .writeText(res)
        .then(() => {
          toast.success("Copied Successfully!");
        })
        .catch(() => {
          toast.error("Something Went Wrong!");
        });
    } else {
      if (res) {
        fileDownload(res, `Hub-Users-List-${currentDate}.${fileType}`);
      }
    }
  };
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

          <div className="d-flex align-items-center table-header-actions">
            <UncontrolledDropdown className="me-1">
              <DropdownToggle color="secondary" caret outline>
                <Share className="font-small-4 me-50" />
                <span className="align-middle">Export</span>
              </DropdownToggle>
              <DropdownMenu>
                {/* <DropdownItem className="w-100"
                  onClick={() => exportFile('csv',"print")}
                  >
                  <Printer className="font-small-4 me-50" />
                  <span className="align-middle">Print</span>
                </DropdownItem> */}
                <DropdownItem
                  className="w-100"
                  onClick={() => exportFile("csv", "")}
                >
                  <FileText className="font-small-4 me-50" />
                  <span className="align-middle">CSV</span>
                </DropdownItem>
                <DropdownItem
                  className="w-100"
                  onClick={() => exportFile("xlsx", "")}
                >
                  <Grid className="font-small-4 me-50" />
                  <span className="align-middle">Excel</span>
                </DropdownItem>
                <DropdownItem
                  className="w-100"
                  onClick={() => exportFile("pdf", "")}
                >
                  <File className="font-small-4 me-50" />
                  <span className="align-middle">PDF</span>
                </DropdownItem>
                <DropdownItem
                  className="w-100"
                  onClick={() => exportFile("csv", "copy")}
                >
                  <Copy className="font-small-4 me-50" />
                  <span className="align-middle">Copy</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <Link to="/users/create">
              <Button
                className="add-new-user orange-bg orange-border"
                color="primary"
              >
                Add New User
              </Button>
            </Link>
          </div>
        </Col>
      </Row>
    </div>
  );
};

const UsersList = () => {
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
  const columns = [
    {
      name: "User",
      sortable: true,
      minWidth: "300px",
      sortField: "first_name",
      selector: (row) => row.fullName,
      cell: (row) => (
        <div className="d-flex justify-content-left align-items-center">
          {renderClient(row)}
          <div className="d-flex flex-column">
            <Link
              to={`/apps/user/view/${row.id}`}
              className="user_name text-truncate text-body"
              onClick={() => store.dispatch(getUser(row.id))}
            >
              <span className="fw-bolder">
                {row.first_name} {row.last_name}
              </span>
            </Link>
            <small className="text-truncate text-muted mb-0">{row.email}</small>
          </div>
        </div>
      ),
    },
    {
      name: "Involved in total service",

      minWidth: "172px",
      selector: (row) => row.services_count,
    },
    {
      name: "Last Active",
      minWidth: "138px",
      sortable: true,
      sortField: "last_login",
      selector: (row) => row.last_login,
      cell: (row) => row.last_login,
    },
    {
      name: "Status",
      minWidth: "138px",
      selector: (row) => row.status,
      cell: (row) => (
        <Badge
          className="text-capitalize new-custom-badge-for-userlist"
          color={statusObj[row.status]}
          pill
        >
          {row.status}
        </Badge>
      ),
    },
    {
      name: "Actions",
      minWidth: "100px",
      cell: (row) => {
        const changeStatusOfUser = async (userid, status) => {
          let res = await actionModal({
            title: "Are You sure?",
            icon: "warning",
            text: `You want to ${status} this User?`,
            confirmText: `Yes ${status} User`,
          });
          if (res == true) {
            let statusFormatted = status == "Activate" ? "active" : "inactive";
            let res = await changeStatus(userid, statusFormatted);
            if (res.success) {
              toast.success(res.message);
              //reload user data
              dispatch(
                getData({
                  sort_order: sort,
                  sort_column: sortColumn,
                  keyword: searchTerm,
                  page: currentPage,
                  perPage: rowsPerPage,
                  service_id: currentService.id,
                  status: currentStatus.value,
                })
              );
            } else {
              toast.error(res.message);
            }
          }
        };
        const handleDeleteClick = async (userid) => {
          let res = await actionModal({
            title: "Are You sure?",
            icon: "warning",
            text: `You won't be able to revert User!`,
            confirmText: `Yes, Delete User!`,
          });
          if (res == true) {
            let res = await deactivateUser(userid);
            if (res.success) {
              toast.success(res.message);
              dispatch(
                getData({
                  sort_order: sort,
                  sort_column: sortColumn,
                  keyword: searchTerm,
                  page: currentPage,
                  perPage: rowsPerPage,
                  service_id: currentService.id,
                  status: currentStatus.value,
                })
              );
            } else {
              toast.error(res.message);
            }
          }
        };
        const resendMailToUser = async (userid) =>{
          let res =await reInviteUser(userid);
          if(res.success){
            toast.success(res.message);
          }
          else{
            toast.error(res.message)
          }
        }
        return (
          <div className="column-action">
            <div className="d-flex align-items-center justify-content-evenly">
              <Link to={`/users/edit/${row.id}`} id={"edit" + row.id}>
                <div className="icon-1">
                  <Edit size={20} />
                </div>
                <UncontrolledTooltip placement="auto" target={`edit${row.id}`}>
                  Edit
                </UncontrolledTooltip>
              </Link>

              {row.status == "inactive" ? (
                <div
                  className="icon-1 green-icon-1"
                  onClick={() => {
                    changeStatusOfUser(row.id, "Activate");
                  }}
                  id={`check${row.id}`}
                >
                  <CheckCircle size={20} />
                  <UncontrolledTooltip
                    placement="auto"
                    target={`check${row.id}`}
                  >
                    Activate
                  </UncontrolledTooltip>
                </div>
              ) : row.status == "invited" ? (
                <div className="mail-icon" onClick={()=>resendMailToUser(row.id)} id={`invite${row.id}`}>
                  <Mail size={20} />
                  <UncontrolledTooltip
                    placement="auto"
                    target={`invite${row.id}`}
                  >
                    Reinvite
                  </UncontrolledTooltip>
                </div>
              ) : (
                <div
                  className="icon-1  "
                  id={`deactivate${row.id}`}
                  onClick={() => {
                    changeStatusOfUser(row.id, "Deactivate");
                  }}
                >
                  <XCircle size={20} />
                  <UncontrolledTooltip
                    placement="auto"
                    target={`deactivate${row.id}`}
                  >
                    Deactivate
                  </UncontrolledTooltip>
                </div>
              )}
              <div className="icon-1 delete-icon" id={`delete${row.id}`}>
                <Trash size={20} onClick={() => handleDeleteClick(row.id)} />
                <UncontrolledTooltip
                  placement="auto"
                  target={`delete${row.id}`}
                >
                  Delete
                </UncontrolledTooltip>
              </div>
              <div className="icon-history" id={`history${row.id}`}>
                <i className="fa-solid fa-clock-rotate-left"></i>
              </div>
              <UncontrolledTooltip placement="auto" target={`history${row.id}`}>
                Quick History
              </UncontrolledTooltip>
            </div>
          </div>
        );
      },
    },
  ];

  // ** Get data on mount
  useEffect(() => {
    dispatch(
      getData({
        sort_order: sort,
        sort_column: sortColumn,
        keyword: searchTerm,
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
  // ** User filter options

  const statusOptions = [
    { value: "all", label: "Select All" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "never-logged-in", label: "Never Logged In" },
    { value: "invited", label: "Invited" },
  ];

  // ** Function in get data on page change
  const handlePagination = (page) => {
    dispatch(
      getData({
        sort_order: sort,
        sort_column: sortColumn,
        keyword: searchTerm,
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
        sort_order: sort,
        sort_column: sortColumn,
        keyword: searchTerm,
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
        sort_order: sort,
        keyword: val,
        sort_column: sortColumn,
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
      keyword: searchTerm,
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
  };

  const selectAllOption = [{ id: 0, name: "Select All" }];
  return (
    <Fragment>
      <Card>
        <CardHeader>
          <CardTitle tag="h4">Filters</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md="4">
              <Label for="role-select">Service wise users</Label>
              <Select
                isClearable={false}
                value={currentService}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                options={[...selectAllOption, ...serviceOption]}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
                onChange={(data) => {
                  setCurrentService(data);
                  dispatch(
                    getData({
                      sort_order: sort,
                      sort_column: sortColumn,
                      keyword: searchTerm,
                      service_id: data.id,
                      page: currentPage,
                      perPage: rowsPerPage,
                      status: currentStatus.value,
                    })
                  );
                }}
              />
            </Col>
            <Col md="4">
              <Label for="status-select">Status</Label>
              <Select
                theme={selectThemeColors}
                isClearable={false}
                className="react-select"
                classNamePrefix="select"
                options={statusOptions}
                value={currentStatus}
                onChange={(data) => {
                  setCurrentStatus(data);
                  dispatch(
                    getData({
                      sort_order: sort,
                      sort_column: sortColumn,
                      keyword: searchTerm,
                      page: currentPage,
                      status: data.value,
                      perPage: rowsPerPage,
                      service_id: currentService.id,
                    })
                  );
                }}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>

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
    </Fragment>
  );
};

export default UsersList;
