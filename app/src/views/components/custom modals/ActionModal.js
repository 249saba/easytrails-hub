import React from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
export function actionModal(props) {
  return MySwal.fire({
        title: props.title ? props.title : "Are you sure?",
        text: props.text ? props.text : "You want to this Action",
        icon: props.icon ? props.icon : "warning",
        showCancelButton: true,
        confirmButtonText:props.confirmText ? props.confirmText : "Yes Action",
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ms-1",
        },
        buttonsStyling: false,
      }).then(async function (result) {
        return result.value 
      })

}
