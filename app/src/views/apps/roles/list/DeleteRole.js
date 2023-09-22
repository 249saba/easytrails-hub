import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { Spinner } from "reactstrap";
import { Col } from "reactstrap";
import toast from "react-hot-toast";
import { deleteRoles } from "../../../../api/role";
import "../../../../@core/components/rolestyle/index.scss";

function DeleteRole({ deleteModal, handleModalDelete, role_id }) {
  const [isDeleteLoader, setIsDeleteLoader] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    setIsDeleteLoader(true);
  };

  const deleteRole = async () => {
    let result = await deleteRoles(role_id);
    setIsDeleteLoader(false);
    if (result.success) {
      handleModalDelete();
      toast.success(" Role Deleted Successfully");
    } else {
      toast("Try Again");
    }
  };
  return (
    <Modal
      isOpen={deleteModal}
      toggle={() => handleModalDelete()}
      className="modal-dialog modal-lg modal-dialog-centered "
    >
      <ModalHeader toggle={() => handleModalDelete()}></ModalHeader>
      <ModalBody className="role-modal">
        <form id="editRoleForm" class="row g-3" onSubmit={handleSubmit}>
          <Col lg={12} md={6} sm={3} className="text-center">
            <i class="feather icon-alert-circle delete-icon"></i>
            <br />
            <div class="text-center delete-txt mt-2">
              {" "}
              Are you sure you want to deactivate this Role?
            </div>
          </Col>
          <Col lg={12} md={6} sm={3} className="text-center mt-4">
            <button
              class="btn btn-danger waves-effect waves-light me-sm-3 me-1"
              onClick={deleteRole}
            >
              {isDeleteLoader ? <Spinner size={"sm"} /> : "Yes"}
            </button>
            <button
              type="submit"
              class="btn btn-success waves-effect waves-light me-sm-3 me-1"
              onClick={handleModalDelete}
            >
              No
            </button>
          </Col>
        </form>
      </ModalBody>
    </Modal>
  );
}

export default DeleteRole;
