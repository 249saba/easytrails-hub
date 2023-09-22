import React, { useState, useEffect } from "react";
import { getServiceData, getRolesData } from "../store";
import { Row, Col, Card, Badge, UncontrolledTooltip } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { Edit, XCircle, CheckCircle } from "react-feather";
import withReactContent from "sweetalert2-react-content";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";
import { changeStatus } from "../../../../api/role";
import AddRole from "./CreateUpdate";
import DeleteRole from "./DeleteRole";
import "../../../../@core/components/rolestyle/index.scss";
import { actionModal } from "../../../components/custom modals/ActionModal";
import { toast } from "react-hot-toast";
function manageRole() {
  const [addModal, setaddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editModal, seteditModal] = useState(false);
  const [deleteModal, setdeleteModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [service, setService] = useState(1);
  const [role_id, setRole_id] = useState();
  const [serviceOption, setServiceOption] = useState([]);
  const [allRoles, setallRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [role, setRole] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const MySwal = withReactContent(Swal);
  const dispatch = useDispatch();
  const store = useSelector((state) => state.service);
  const statusObj = {
    1: "light-success",
    0: "light-danger",
  };

  useEffect(() => {
    setIsLoading(true);
    dispatch(getServiceData());
  }, []);
  useEffect(() => {
    dispatch(
      getRolesData({
        service: service,
        rowsPerPage: rowsPerPage,
        page: currentPage,
      })
    );
  }, [service, addModal, editModal]);

  useEffect(() => {
    setIsLoading(false);
    setServiceOption(store.data);
  }, [store.data]);
  useEffect(() => {
    setallRoles(store.roleData);
  }, [store.roleData]);

  const handleModal = () => {
    setaddModal(!addModal);
  };
  const handleModalEdit = (role, id) => {
    setRole({ ...role });
    seteditModal(!editModal);
    setRole_id(id);
  };
  const dataToRender = () => {
    if (store.data?.length > 0) {
      return store.roleData;
    } else if (store.roleData?.length === 0) {
      return [];
    }
  };
  const changeStatusOfRole = async (roleid, status) => {
    let res = await actionModal({
      title: "Are You sure?",
      icon: "warning",
      text: `You want to ${status} this Role?`,
      confirmText: `Yes ${status} Role!`,
    });
    if (res == true) {
      let statusFormatted = status == "Activate" ? "active" : "inactive";
      let res = await changeStatus(roleid, {status: statusFormatted});
      if (res.success) {
        toast.success(res.message);
        dispatch(
          getRolesData({
            service: service,
            rowsPerPage: rowsPerPage,
            page: currentPage,
          }));
      } else {
        toast.error(res.message);
      }
    }
  };

  const handleClick = (index, serviceid) => {
    setActiveIndex(index);
    setService(serviceid);
  };
  const handlePagination = (page) => {
    dispatch(
      getRolesData({
        service: service,
        rowsPerPage: rowsPerPage,
        page: page.selected + 1,
      })
    );
    setCurrentPage(page.selected + 1);
  };
  const columns = [
    {
      name: "Role",
      sortable: true,
      minWidth: "172px",
      sortField: "name",
      selector: (row) => row.name,
    },
    {
      name: "Status",
      minWidth: "138px",
      sortable: true,
      sortField: "active",
      selector: (row) => row.active,
      cell: (row) => (
        <Badge
          className="text-capitalize new-custom-badge-for-active-deactive"
          color={statusObj[row.active]}
          pill
        >
          {row.active ? "Active" : "Deactive"}
        </Badge>
      ),
    },
    {
      name: "Actions",
      minWidth: "100px",
      cell: (row) => {
        return (
          <div className="column-action">
            <div className="d-flex">
              <div
                className="icon-1"
                id={`editIcon${row.id}`}
                onClick={() => {
                  handleModalEdit(row, row.id);
                }}
              >
                <Edit size={20} />
                <UncontrolledTooltip
                  placement="auto"
                  target={`editIcon${row.id}`}
                >
                  Edit
                </UncontrolledTooltip>
              </div>

              {row.active == "0" ? (
                <div
                  className="icon-1 green-icon-1"
                  id={`activateIcon${row.id}`}
                  onClick={() => {
                    changeStatusOfRole(row.id, "Activate");
                  }}
                >
                  <CheckCircle size={20} />
                  <UncontrolledTooltip
                    placement="auto"
                    target={`activateIcon${row.id}`}
                  >
                    Activate
                  </UncontrolledTooltip>
                </div>
              ) : (
                <div
                  className="icon-1 "
                  id={`deactivateIcon${row.id}`}
                  onClick={() => {
                    changeStatusOfRole(row.id, "Deactivate");
                  }}
                >
                  <XCircle size={20} />
                  <UncontrolledTooltip
                    placement="auto"
                    target={`deactivateIcon${row.id}`}
                  >
                    Deactivate
                  </UncontrolledTooltip>
                </div>
              )}
            </div>
          </div>
        );
      },
    },
  ];
  const CustomPagination = () => {
  
     const count = Number(Math.ceil(store?.total / rowsPerPage));
  

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
  return (
    <div className="content-wrapper role-content">
      <div className="content-body">
        <section id="page-account-settings">
          <Row className="Role-card-height">
            <div className="col-md-3 mb-2 mb-md-0 right-border">
              <ul className="nav nav-pills flex-column mt-md-1  d-flex align-items-start">
                {serviceOption?.length > 0 &&
                  serviceOption?.map((service, index) => (
                    <li className="nav-item mt-1" key={index}>
                      <div
                        className="d-flex align-items-center cursor-pointer "
                        onClick={() => handleClick(index, service.id)}
                      >
                        <a
                          className={
                            activeIndex === index
                              ? "nav-link   active nav-link-width"
                              : "nav-link nav-link-width "
                          }
                        >
                          <i className={`${service.icon_name}`}></i>
                        </a>
                        <span className="service-item"> {service.name}</span>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
            <Col lg={9} md={12} sm={12} className="card mt-md-1 ">
              <Col className="add-new-role">
                <div className="btn-group dt-buttons">
                  <button
                    type="button"
                    className=" btn btn-outline-primary btn  text-nowrap  mb-2 add-new-role"
                    onClick={handleModal}
                  >
                    <span>
                      <i className="feather icon-plus"></i> Add New Role
                    </span>
                  </button>
                </div>
              </Col>

              <Card className="overflow-hidden">
                <div className="react-dataTable">
                  <DataTable
                    noHeader
                    sortServer
                    pagination
                    responsive
                    paginationServer
                    columns={columns}
                    data={dataToRender()}
                    className="react-dataTable"
                    paginationComponent={CustomPagination}
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </section>
      </div>
      {addModal ? (
        <AddRole
          handleModal={handleModal}
          addModal={addModal}
          modalheading="Add New Role"
          service={service}
        />
      ) : (
        ""
      )}
      {editModal ? (
        <AddRole
          handleModal={handleModalEdit}
          addModal={editModal}
          modalheading="Edit Role"
          roleData={role}
          service={service}
          role_id={role_id}
        />
      ) : (
        ""
      )}
      {deleteModal ? (
        <DeleteRole
          handleModalDelete={handleModalDelete}
          deleteModal={deleteModal}
          role_id={role_id}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default manageRole;
