function outFunc() {
    var tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Copy to clipboard";
}
document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.querySelector('.toggle-button');
    const navbarLinks = document.querySelector('.navbar-links');

    toggleButton.addEventListener('click', function () {
        navbarLinks.classList.toggle('active');
    });
});