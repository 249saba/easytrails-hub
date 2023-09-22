// ** React Imports
import React, { Fragment, useState, useEffect } from "react";
// ** Invoice List Sidebar

// ** Store & Actions
import { getData } from "../store/activity";
import { useDispatch, useSelector } from "react-redux";

// ** Third Party Components
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";

// ** Reactstrap Imports
import { Row, Col, Card, Input, Badge } from "reactstrap";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";

import Avatar from "@components/avatar";

// ** Renders Client Columns
const renderClient = (row) => {
  return (
    <Avatar
      initials
      className='me-1'
      color={row.avatarColor || "light-primary"}
      content={row.name || "John Doe"}
    />
  );
};

// ** Table Header
const CustomHeader = ({
  store,
  handlePerPage,
  rowsPerPage,
  handleFilter,
  searchTerm,
}) => {
  return (
    <div className='invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75'>
      <Row>
        <Col xl='6' className='d-flex align-items-center p-0'>
          <div className='d-flex align-items-center w-100'>
            <label htmlFor='rows-per-page'>Show</label>
            <Input
              className='mx-50'
              type='select'
              id='rows-per-page'
              value={rowsPerPage}
              onChange={handlePerPage}
              style={{ width: "5rem" }}>
              <option value='10'>10</option>
              <option value='25'>25</option>
              <option value='50'>50</option>
            </Input>
            <label htmlFor='rows-per-page'>Entries</label>
          </div>
        </Col>
        <Col
          xl='6'
          className='d-flex align-items-sm-center justify-content-xl-end justify-content-start flex-xl-nowrap flex-wrap flex-sm-row flex-column pe-xl-1 p-0 mt-xl-0 mt-1'>
          <div className='d-flex align-items-center mb-sm-0 mb-1 me-1'>
            <label className='mb-0' htmlFor='search-invoice'>
              Search:
            </label>
            <Input
              id='search-invoice'
              className='ms-50 w-100'
              type='text'
              value={searchTerm}
              onChange={(e) => handleFilter(e.target.value)}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

const UserTimeline = ({ selectedUser }) => {
  // ** Store Vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.activites);
  console.log(store);

  // ** States
  const [sort, setSort] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("id");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const columns = [
    {
      name: "User",
      sortable: true,
      minWidth: "300px",
      sortField: "fullName",
      selector: (row) => row.fullName,
      cell: (row) => (
        <div className='d-flex justify-content-left align-items-center'>
          {renderClient(row)}
          <div className='d-flex flex-column'>
            <span className='fw-bolder'>{row.user_data.name}</span>
          </div>
        </div>
      ),
    },
    {
      name: "Module",
      sortable: true,
      minWidth: "172px",
      sortField: "role",
      selector: (row) => row.model_name.split("\\").pop(),
    },
    {
      name: "Title & Description ",
      minWidth: "138px",
      sortable: true,
      sortField: "last_login",
      selector: (row) => row.last_login,
      cell: (row) => (
        <div className='d-flex justify-content-left align-items-center'>
          <div className='d-flex flex-column'>
            <span className='fw-bolder'>{row.title}</span>
            <small className='text-truncate text-muted mb-0'>
              {row.description}
            </small>
          </div>
        </div>
      ),
    },
    {
      name: "Date time",
      minWidth: "138px",
      sortable: true,
      sortField: "status",
      selector: (row) => row.status,
      cell: (row) => row.activity_date,
    },
    {
      name: "Location ip",
      minWidth: "138px",
      sortable: true,
      sortField: "last_login",
      selector: (row) => row.last_login,
      cell: (row) => row.ip_address,
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
        user_id: selectedUser.id,
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
        user_id: selectedUser.id,
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
        user_id: selectedUser.id,
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
        user_id: selectedUser.id,
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
        activeClassName='active'
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
        user_id: selectedUser.id,
      })
    );
  };

  return (
    <Fragment>
      <Card className='overflow-hidden'>
        <div className='react-dataTable'>
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
            className='react-dataTable'
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

export default UserTimeline;
