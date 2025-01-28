import Swal from "sweetalert2";

const DeletedAlert = (onConfirm, onCancel) => {
const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "bg-green text-white px-4 py-2 rounded-md hover:bg-green-600 mr-2bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 ml-4",
      cancelButton: "bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600",
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: "Apakah anda yakin?",
      text: "Anda tidak bisa mengembalikan data ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Tidak, Batal!",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire({
          title: "Terhapus!",
          text: "Data anda telah terhapus.",
          icon: "success",
        });
        if (onConfirm) onConfirm(); // Callback when confirmed
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: "Batal",
          text: "Data anda aman :)",
          icon: "error",
        });
        if (onCancel) onCancel(); // Callback when cancelled
      }
    });
};

export default DeletedAlert;
