$(document).ready(function () {
    $(".card").click(function () {
        var id = $(this).attr("id");
        window.location.href = "/posts/" + id;
    });
});
