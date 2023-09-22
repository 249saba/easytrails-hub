// ** Styles
import "@styles/react/apps/app-users.scss";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-hot-toast";

// ** Reactstrap Imports
import { Row, Col, Card, Input, Button } from "reactstrap";
// ** Styles
import "@styles/react/libs/tables/react-dataTable-component.scss";

import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  deleteSite,
  createSite,
  updateSite,
  getSingleSite,
} from "../../../../api/site";
import {
  getAllCountries,
  getTimeZonesByCountry,
} from "../../../../api/country";

import { useDispatch, useSelector } from "react-redux";
import { getData } from "../store";
// ** Third Party Components

import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import { ChevronDown, Edit, Trash } from "react-feather";

// ** Utils
import { selectThemeColors } from "@utils";
import CreateUpdate from "./CreateUpdate";
import { actionModal } from "../../../components/custom modals/ActionModal";

const defaultValue = {
  trial_id: "",
  code: "",
  title: "",
  address: "",
  country_id: "",
  timezone_id: "",
  email_address: "",
  consent_type: "",
  manual_enrollment: "",
  phone_number: "",
};
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

          <div className="d-flex align-items-center table-header-actions vertically-centered-modal">
            <Button
              className="add-new-sponsor orange-bg orange-border"
              color="primary"
              onClick={() => {
                setCenteredModal(!centeredModal);
              }}
            >
              Add New Site
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

const SiteList = () => {
  // ** Store Vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.sites);

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

  const id = useParams();

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
        trialId: id.id,
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
        perPage: rowsPerPage,
        page: page.selected + 1,
        service_id: currentService.id,
        status: currentStatus.value,
        trialId: id.id,
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
        trialId: id.id,
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
        trialId: id.id,
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

  const [centeredModal, setCenteredModal] = useState(false);
  const [siteData, setSiteData] = useState(defaultValue);
  const [countries, setCountries] = useState([]);
  const [timezones, setTimezones] = useState([]);
  const [formError, setFromError] = useState([{}]);
  let navigate = useNavigate();
  useEffect(() => {
    getCountries();
  }, []);

  const getCountries = async () => {
    let res = await getAllCountries();
    setCountries(res.data);
  };
  const countryOptions = countries.map((val) => ({
    value: val.id,
    label: val.name,
  }));
  const getTimeZones = async (country_id) => {
    let res = await getTimeZonesByCountry(country_id);
    setTimezones(res.data);
    return res;
  };
  const selectCountry = (e) => {
    setSiteData((query) => ({
      ...query,
      country_id: e.value,
    }));
    getTimeZones(e.value);
  };
  const selectTimeZone = (e) => {
    setSiteData((query) => ({
      ...query,
      timezone_id: e.value,
    }));
  };

  const timezoneOptions = timezones.map((val) => ({
    value: val.id,
    label: val.name,
  }));
  const trialid = useParams();

  const handleChange = (e) => {
    if (!siteData.trial_id) {
      setSiteData((query) => ({
        ...query,
        trial_id: trialid.id,
      }));
    }
    if (e.target.name == "manual_enrollment") {
      setSiteData((query) => ({
        ...query,
        [e.target.name]: e.target.value === "0" ? false : true,
      }));
    } else {
      setSiteData((query) => ({
        ...query,
        [e.target.name]: e.target.value,
      }));
    }
  };
  let error = [];
  const handleSubmit = async (formIs) => {
    for (let i in siteData) {
      if (siteData[i].toString().length > 0) {
      } else {
        error.push({ [i]: "*This field is required" });
      }
    }
    if (!(error.length > 0)) {
      let res;
      if (formIs == "new") {
        res = await createSite(siteData);
      } else {
        res = await updateSite(siteData.id, siteData);
      }
      if (res.success) {
        toast.success(res.message);
        setSiteData("");
        navigate(window.location.pathname);
      } else {
        toast.error(res.message);
        
      }
      setFromError([]);
    } else {
      setFromError(error);
    }
  };
  const MySwal = withReactContent(Swal);

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
      name: "Site Lab Name",
      sortable: true,
      minWidth: "172px",
      sortField: "name",
      selector: (row) => row.title,
    },
    {
      name: "Site Address",
      minWidth: "138px",
      sortable: true,
      sortField: "trials_count",
      selector: (row) => row.address,
      cell: (row) => row.address,
    },
    {
      name: "Country",
      minWidth: "100px",
      sortable: true,
      sortField: "active",
      selector: (row) => row,
      cell: (row) => row.country.name,
    },
    {
      name: "Timezone",
      minWidth: "100px",
      sortable: true,
      sortField: "active",
      selector: (row) => row,
      cell: (row) => row.timezone.name,
    },
    {
      name: "Contact No",
      minWidth: "138px",
      sortable: true,
      sortField: "trials_count",
      selector: (row) => row.phone_number,
      cell: (row) => row.phone_number,
    },
    {
      name: "Consent Type",
      minWidth: "138px",
      sortable: true,
      sortField: "trials_count",
      selector: (row) => row.consent_type,
      cell: (row) => row.consent_type,
    },
    {
      name: "Manual Enrollment",
      minWidth: "138px",
      sortable: true,
      sortField: "trials_count",
      selector: (row) => row.manual_enrollment,
      cell: (row) => (row.manual_enrollment ? "On" : "Off"),
    },
    {
      name: "Actions",
      minWidth: "100px",
      cell: (row) => {
        const navigate = useNavigate();
        useEffect(() => {
          if (siteData.country_id !== "") getTimeZones(siteData.country_id);
        }, [siteData.country_id]);
        const editSite = async (row) => {
          let getSite = await getSingleSite(row.id).then((data) => {
            return data;
          });
          setCenteredModal(!centeredModal);
          setSiteData((data) => ({
            ...data,
            id: row.id,
            trial_id: getSite.data.trial_id,
            code: getSite.data.code,
            title: getSite.data.title,
            address: getSite.data.address,
            country_id: getSite.data.country_id,
            timezone_id: getSite.data.timezone_id,
            email_address: getSite.data.email_address,
            consent_type: getSite.data.consent_type,
            manual_enrollment: getSite.data.manual_enrollment,
            phone_number: getSite.data.phone_number,
          }));
        };

        const handleDeleteClick = async (siteid) => {
          let res = await actionModal({
            title: "Are You sure?",
            icon: "warning",
            text: `You won't be able to revert Site!`,
            confirmText: `Yes, Delete Site!`,
          });
          if (res == true) {
            let res = await deleteSite(siteid);
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
                })
              );
            } else {
              toast.error(res.message);
            }
          }
        };
        return (
          <div className="column-action">
            <div className="d-flex">
              <div
                className="icon-1"
                onClick={() => {
                  editSite(row);
                }}
              >
                <Edit size={20} />
              </div>

              <div className="icon-1">
                <Trash size={20} onClick={() => handleDeleteClick(row.id)} />
              </div>
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <>
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
      <CreateUpdate
        centeredModal={centeredModal}
        setCenteredModal={setCenteredModal}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        siteData={siteData}
        formError={formError}
        selectThemeColors={selectThemeColors}
        countryOptions={countryOptions}
        timezoneOptions={timezoneOptions}
        selectCountry={selectCountry}
        selectTimeZone={selectTimeZone}
      />
    </>
  );
};

export default SiteList;
