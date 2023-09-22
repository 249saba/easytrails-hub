// ** React Imports
import { Fragment, useState, useEffect } from "react";

// ** Store & Actions
import { getData } from "../store";
import { useDispatch, useSelector } from "react-redux";

// ** Third Party Components
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import { toast } from "react-hot-toast";
import { ChevronDown, Edit, Trash } from "react-feather";
// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Input,
  Button,
  Modal,
  Label,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { Link } from "react-router-dom";
import {
  createLanguage,
  updateLanguage,
  deleteLanguage,
  getSingleLocation,
} from "../../../../api/language";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { actionModal } from "../../../components/custom modals/ActionModal";

// ** Table Header
const CustomHeader = ({
  store,
  handlePerPage,
  rowsPerPage,
  handleFilter,
  searchTerm,
  setCenteredModal,
  centeredModal,
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
            <Button
              className="add-new-user orange-bg orange-border"
              color="primary"
              onClick={() => setCenteredModal(!centeredModal)}
            >
              Add New Language
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

const LanguagesList = () => {
  // ** Store Vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.languages);

  // ** States
  const [sort, setSort] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("id");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const MySwal = withReactContent(Swal);

  const handleEdit = async (id) => {
    let res = await getSingleLocation(id);
    setCenteredModal(true);
    setFormData(res.data);
  };

  const columns = [
    {
      name: "Language Id",
      sortable: true,
      minWidth: "150px",
      sortField: "role",
      selector: (row) => row.id,
    },
    {
      name: "Language Name",
      sortable: true,
      minWidth: "172px",
      sortField: "role",
      selector: (row) => row.name,
    },
    {
      name: "Language code",
      minWidth: "230px",
      sortable: false,
      cell: (row) => row.code,
    },
    {
      name: "Actions",
      minWidth: "100px",
      cell: (row) => (
        <div className="column-action">
          <div className="d-flex">
            <div className="icon-1" onClick={() => handleEdit(row.id)}>
              <Edit size={20} />
            </div>
            <div className="icon-1">
              <Trash size={20} onClick={() => handleDeleteClick(row.id)} />
            </div>
          </div>
        </div>
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
    console.log("page",page)
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
  const [centeredModal, setCenteredModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", code: "" });
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
  const handleSubmit = async () => {
    if (formData.name !== "" && formData.code !== "") {
      let res;
      if (formData.id !== undefined)
        res = await updateLanguage(formData.id, formData);
      else res = await createLanguage(formData);
      if (res.success) {
        toast.success(res.message);
        setCenteredModal(!centeredModal);
        setFormData({ name: "", code: "" });
      } else {
        toast.error(res.message);
      }
    } else {
      toast.error("Name and Short code is required");
    }
    // re fetch list
    reloadList();
  };

  const hangleInputChange = (e) => {
    setFormData((data) => ({
      ...data,
      [e.target.name]: e.target.value,
    }));
  };
  const handleDeleteClick = async (languageid) => {
    let res = await actionModal({
      title: "Are You sure?",
      icon: "warning",
      text: `You won't be able to revert Language!`,
      confirmText: `Yes, Delete Language!`,
    });
    if (res == true) {
      let res = await deleteLanguage(languageid);
      if (res.success) {
        toast.success(res.message);
        reloadList();
        
      } else {
        toast.error(res.message);
      }
    }
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
                store={store}
                searchTerm={searchTerm}
                rowsPerPage={rowsPerPage}
                handleFilter={handleFilter}
                handlePerPage={handlePerPage}
                setCenteredModal={setCenteredModal}
                centeredModal={centeredModal}
              />
            }
          />
        </div>
      </Card>

      <Modal
        isOpen={centeredModal}
        toggle={() => setCenteredModal(!centeredModal)}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>
          { formData.id ? "Edit New Language" : "Add New Language" }
        </ModalHeader>
        <ModalBody>
          <div className="mb-1">
            <Label className="form-label" for="new-password">
              Language Name <span style={{color:"crimson",fontWeight:"700"}}>*</span>
            </Label>
            <Input
              className={`input-group-merge`}
              name="name"
              onChange={hangleInputChange}
              value={formData.name}
              placeholder="Enter a Language name"
              autoFocus
            />
          </div>
          <div className="mb-1">
            <Label className="form-label" for="new-password">
              Language Code <span style={{color:"crimson",fontWeight:"700"}}>*</span>
            </Label>
            <Input
              className={`input-group-merge`}
              name="code"
              onChange={hangleInputChange}
              value={formData.code}
              placeholder="Enter a Language code"
              autoFocus
            />
          </div>
        </ModalBody>
        <ModalFooter className="d-flex align-items-center justify-content-center">
          <Button color="primary" onClick={handleSubmit}>
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
    </div>
  );
};

export default LanguagesList;
