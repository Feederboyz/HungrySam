$(document).ready(function () {
    $("[data-del-btn]").click(function () {
        if (confirm("Are you sure you want to delete this post?")) {
            const commentId = $(this).attr("data-del-btn");
            fetch(`/posts/comments`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    commentId: commentId,
                }),
            })
                .then((response) => {
                    if (response.ok) {
                        return response.text();
                    } else {
                        throw new Error("Error deleting comment");
                    }
                })
                .then((data) => {
                    console.log("Post deleted:", data);
                    location.reload();
                })
                .catch((error) => {
                    console.error("Error deleting post:", error);
                    alert("Failed to delete the post.");
                });
        } else {
            console.log("Delete canceled");
        }
    });
});

$(document).ready(function () {
    $("[data-edit-btn]").click(function () {
        var commentId = $(this).attr("data-edit-btn");
        $('[data-edit-field="' + commentId + '"]').toggle();
    });
});
