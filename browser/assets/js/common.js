document.addEventListener("DOMContentLoaded", function () {
        if ($(".commonDatatableInit").length > 0) {
          $(".commonDatatableInit").DataTable({
            responsive: false,
            autoWidth: false,
            info: false,
            paging: false,
            lengthChange: false,
            searching: false,
            ordering: false,
            scrollX: true,
            // scrollY: "350px",
            scrollCollapse: true,
            // dom: '<"top"lfB>rt<"bottom"i>p',
            // buttons: ["copy", "csv", "excel", "print", "pdf"],
            initComplete: function () {
              setTimeout(function () {
                $(window).trigger("resize");
              }, 100);
              $(".dataTables_wrapper .dataTables_filter input").attr(
                "placeholder",
                "Search here..."
              );
            },
          });

          $(window).resize(function () {
            $(".commonDatatableInit")
              .DataTable()
              .columns.adjust()
              .responsive.recalc();
          });
        }
      });