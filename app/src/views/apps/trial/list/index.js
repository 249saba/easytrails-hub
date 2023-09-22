// ** React Imports
import React, { useState, useEffect } from "react";

// ** Store & Actions
import { getData } from "../store";
import { useDispatch, useSelector } from "react-redux";

// ** Third Party Components
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import { CheckCircle, ChevronDown, Edit, Trash, XCircle } from "react-feather";
// ** Reactstrap Imports
import { Row, Col, Card, Input, Button, Badge } from "reactstrap";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { changeTrialStatus, deleteTrial } from "../../../../api/trials";
import { actionModal } from "../../../components/custom modals/ActionModal";
import { toast } from "react-hot-toast";

// ** Table Header
const CustomHeader = ({
  handlePerPage,
  rowsPerPage,
  handleFilter,
  searchTerm,
}) => {
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
              style={{ width: "5rem" }}>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </Input>
            <label htmlFor="rows-per-page">Entries</label>
          </div>
        </Col>
        <Col
          xl="6"
          className="d-flex align-items-sm-center justify-content-xl-end justify-content-start flex-xl-nowrap flex-wrap flex-sm-row flex-column pe-xl-1 p-0 mt-xl-0 mt-1">
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
        </Col>
      </Row>
    </div>
  );
};

const TrialsList = () => {
  // ** Store Vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.trials);
  const navigate = useNavigate();
  // ** States
  const [sort, setSort] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("id");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const MySwal = withReactContent(Swal);

  const statusObj = {
    1: "light-success",
    0: "light-danger",
  };
  const changeStatusOfTrial = async (trialid, status) => {
    let res = await actionModal({
      title: "Are You sure?",
      icon: "warning",
      text: `You want to ${status} this Trial?`,
      confirmText: `Yes ${status} Trial`,
    });
    if (res == true) {
      let statusFormatted = status == "Activate" ? "active" : "inactive";
      let res = await changeTrialStatus(trialid, statusFormatted);
      if (res.success) {
        toast.success(res.message);
        //reload user data
        
          reloadList()
        
      } else {
        toast.error(res.message);
      }
    }
  };

  const columns = [
    {
      name: "Trial Name",
      sortable: true,
      minWidth: "172px",
      sortField: "role",
      selector: (row) => row.name,
    },
    {
      name: "Study Name",
      minWidth: "230px",
      sortable: false,
      cell: (row) => row.study_number,
    },
    {
      name: "Sponsor",
      minWidth: "230px",
      sortable: false,
      cell: (row) => row.sponsor.name,
    },
    {
      name: "Status",
      minWidth: "230px",
      sortable: false,
      selector: (row) => row.active,
      cell: (row) => (
        <Badge
          className="text-capitalize new-custom-badge-for-active-deactive"
          color={statusObj[row.active]}
          pill>
          {row.active ? "Active" : "Deactive"}
        </Badge>
      ),
    },
    {
      name: "Actions",
      minWidth: "100px",
      cell: (row) => (
        <div className="column-action">
          <div className="d-flex">
            <Link to={`/trial/edit/${row.id}`}>
              <div className="icon-1">
                <Edit size={20} />
              </div>
            </Link>
            {row.active == 0 ? (
              <div
                className="icon-1 green-icon-1"
                onClick={() => {
                  changeStatusOfTrial(row.id, "Activate");
                }}>
                <CheckCircle size={20} />
              </div>
            ) : (
              <div
                className="icon-1 "
                onClick={() => {
                  changeStatusOfTrial(row.id, "Deactivate");
                }}>
                <XCircle size={20} />
              </div>
            )}
            <div className="icon-1">
              <Trash size={20} onClick={() => handleDeleteTrial(row.id)} />
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "Site Locations",
      minWidth: "230px",
      sortable: false,
      cell: (row) => (
        <Link to={`/apps/site/list/${row.id}`}>
          <Button outline className="orange-border orange-text orange-hover-bg">
            Add/Manage Site
          </Button>
        </Link>
      ),
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
        per_page: rowsPerPage,
      })
    );
  }, [dispatch, store.data.length, sort, sortColumn, currentPage]);

  // ** Function in get data on page change
  const handlePagination = (page) => {
    dispatch(
      getData({
        sort,
        sortColumn,
        q: searchTerm,
        per_page: rowsPerPage,
        page: page.selected + 1,
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
        per_page: value,
        page: currentPage,
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
        per_page: rowsPerPage,
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
        per_page: rowsPerPage,
      })
    );
  };
  const reloadList = () => {
    dispatch(
      getData({
        sort,
        sortColumn,
        q: searchTerm,
        page: currentPage,
        per_page: rowsPerPage,
      })
    );
  };

  const handleDeleteTrial = async (trialid) => {
    return MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert Trial!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete Trial!",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-outline-danger ms-1",
      },
      buttonsStyling: false,
    }).then(async function (result) {
      if (result.value) {
        let res = await deleteTrial(trialid);
        if (res.success) {
          MySwal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Trial has been Deleted.",
            customClass: {
              confirmButton: "btn btn-success",
            },
          });
          reloadList();
        } else {
          MySwal.fire({
            title: "Error",
            text: "Something went wrong!",
            icon: "error",
          });
        }
      } else if (result.dismiss === MySwal.DismissReason.cancel) {
        MySwal.fire({
          title: "Cancelled",
          text: "Cancelled Deletion :)",
          icon: "error",
          customClass: {
            confirmButton: "btn btn-success",
          },
        });
      }
    });
  };
  return (
    <div className="app-language-list">
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
                searchTerm={searchTerm}
                rowsPerPage={rowsPerPage}
                handleFilter={handleFilter}
                handlePerPage={handlePerPage}
              />
            }
          />
        </div>
      </Card>
    </div>
  );
};

export default TrialsList;
