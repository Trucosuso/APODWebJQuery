//@ts-check
import { APODController } from "./controller.js";

/**
 * Class representing a card for an APOD Picture.
 * It has thumbnail, title, author, date and 100 characters description
 * @extends HTMLDivElement
 */
class APODCard extends HTMLDivElement {
    /**
     * Create an APOD Card
     * @param {String} thumbnailURL Thumbnail absolute URL
     * @param {String} pictureTitle APOD picture title
     * @param {String} author APOD picture author
     * @param {String} date Uploaded picture date. MM-DD-YYY
     * @param {String} description Description. Will be truncated if its longer than 100 characters
     */
    constructor(thumbnailURL, pictureTitle, author, date, description) {
        super();
        this.classList.add("card", "h-100");

        // Picture
        this.thumbnail = document.createElement("img");
        this.thumbnail.classList.add("card-img-top", "apod-thumbnail");
        this.thumbnail.src = thumbnailURL;
        this.thumbnail.alt = pictureTitle + " by " + author;

        this.appendChild(this.thumbnail);


        // Card body
        let cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        // Picture title
        this.pictureTitle = document.createElement("h5");
        this.pictureTitle.classList.add("card-title");
        this.pictureTitle.textContent = pictureTitle;
        cardBody.appendChild(this.pictureTitle);

        // Picture author
        this.author = document.createElement("h6");
        this.author.classList.add("card-subtitle", "mb-2", "text-muted");
        // Trim author to 50 characters if needed
        if (author.length >= 50) {
            author = author.substring(0, 47) + "...";
        }
        this.author.textContent = author;
        cardBody.appendChild(this.author);

        // Picture short description
        this.description = document.createElement("p");
        this.description.classList.add("card-text");
        // Trim description to 100 characters if needed
        if (description.length >= 100) {
            description = description.substring(0, 97) + "...";
        }
        this.description.textContent = description;
        cardBody.appendChild(this.description);

        this.appendChild(cardBody);


        // Card footer
        let cardFooter = document.createElement("div");
        cardFooter.classList.add("card-footer", "bg-transparent", "border-0", "d-flex", "justify-content-between", "align-items-baseline");

        // More info button
        this.moreInfoButton = document.createElement("input");
        this.moreInfoButton.classList.add("btn", "btn-light");
        this.moreInfoButton.type = "button";
        this.moreInfoButton.value = "More info";
        this.moreInfoButton.dataset.bsToggle = "modal";
        this.moreInfoButton.dataset.bsTarget = "#APODModal";
        cardFooter.appendChild(this.moreInfoButton);

        // Picture date
        this.date = document.createElement("small");
        this.date.classList.add("text-muted", "text-end");
        this.date.textContent = date;
        cardFooter.appendChild(this.date);

        this.appendChild(cardFooter);
    }
}

/**
 * Class representing a navbar to use in APODView
 * @extends HTMLDivElement
 */
class APODMenuBar extends HTMLDivElement {
    /**
     * Create a menu bar
     * @param {String} breakpoint Bootstrap breakpoint in which the menu bar is collapsed. Defaults to lg.
     */
    constructor(breakpoint = "lg") {
        super();
        this.classList.add("navbar", "navbar-expand-" + breakpoint, "navbar-light", "bg-light", "sticky-sm-top");

        let container = document.createElement("div");
        container.classList.add("container-fluid");

        this.logo = document.createElement("a");
        this.logo.classList.add("navbar-brand");
        this.logo.href = "#";
        this.logo.textContent = "APODWeb";
        container.appendChild(this.logo);

        let collapseButton = document.createElement("button");
        collapseButton.classList.add("navbar-toggler");
        collapseButton.type = "button";
        collapseButton.dataset.bsToggle = "collapse";
        collapseButton.dataset.bsTarget = "#navbarToggler";
        collapseButton.setAttribute("aria-controls", "navbarToggler");
        collapseButton.setAttribute("aria-expanded", "false");
        collapseButton.setAttribute("aria-label", "Toggle navigation");
        let buttonIcon = document.createElement("span");
        buttonIcon.classList.add("navbar-toggler-icon");
        collapseButton.appendChild(buttonIcon);
        container.appendChild(collapseButton);

        // Menu
        let menuContainer = document.createElement("div");
        menuContainer.classList.add("collapse", "navbar-collapse", "justify-content-end");
        menuContainer.id = "navbarToggler";

        let form = document.createElement("form");
        form.classList.add("d-" + breakpoint + "-flex", "align-items-baseline");

        // Date inputs
        let dateFromLabel = document.createElement("label");
        dateFromLabel.htmlFor = "dateFrom";
        dateFromLabel.classList.add("form-label", "me-1", "mb-0");
        dateFromLabel.textContent = "From: ";
        form.appendChild(dateFromLabel);

        this.dateFrom = document.createElement("input");
        this.dateFrom.id = "dateFrom";
        this.dateFrom.classList.add("form-control", "me-2", "mb-2", "mb-lg-0");
        this.dateFrom.type = "date";
        this.dateFrom.setAttribute("aria-label", "From");
        this.dateFrom.max = getCurrentDateHTML();
        // Set minimum for dateTo
        this.dateFrom.addEventListener("change", (e) => {
            this.dateTo.min = e.target.value;
            this.disableSearchInputIfDateFilled();
        });
        form.appendChild(this.dateFrom);

        let dateToLabel = document.createElement("label");
        dateToLabel.htmlFor = "dateTo";
        dateToLabel.classList.add("form-label", "me-1", "mb-0");
        dateToLabel.textContent = "To: ";
        form.appendChild(dateToLabel);

        this.dateTo = document.createElement("input");
        this.dateTo.id = "dateTo";
        this.dateTo.classList.add("form-control", "me-5", "mb-3", "mb-lg-0");
        this.dateTo.type = "date";
        this.dateTo.setAttribute("aria-label", "To");
        this.dateTo.max = getCurrentDateHTML();
        // Set maximum for dateFrom
        this.dateTo.addEventListener("change", (e) => {
            this.dateFrom.max = e.target.value;
            this.disableSearchInputIfDateFilled();
        });
        form.appendChild(this.dateTo);

        // Search input
        this.searchInput = document.createElement("input");
        this.searchInput.id = "searchInput";
        this.searchInput.classList.add("form-control", "me-2", "mb-2", "mb-lg-0");
        this.searchInput.type = "search";
        this.searchInput.placeholder = "Search";
        this.searchInput.setAttribute("aria-label", "Search");
        this.searchInput.addEventListener("input", (e) => {
            this.disableDateInputsIfSearchFilled();
        });
        form.appendChild(this.searchInput);

        // Search button
        this.searchButton = document.createElement("input");
        this.searchButton.id = "searchButton";
        this.searchButton.classList.add("btn", "btn-outline-success");
        this.searchButton.type = "button";
        this.searchButton.value = "Search";
        form.appendChild(this.searchButton);

        menuContainer.appendChild(form);
        container.appendChild(menuContainer);
        this.appendChild(container);
    }

    disableSearchInputIfDateFilled() {
        if (this.dateFrom.value != "" && this.dateTo.value != "") {
            this.searchInput.disabled = true;
            this.searchInput.placeholder = "Clear date to search by text";
        } else {
            this.searchInput.disabled = false;
            this.searchInput.placeholder = "Search";
        }
    }

    disableDateInputsIfSearchFilled() {
        if (this.searchInput.value != "") {
            this.dateTo.disabled = true;
            this.dateFrom.disabled = true;
        } else {
            this.dateTo.disabled = false;
            this.dateFrom.disabled = false;
        }
    }

}

/**
 * Class representing a modal window to show extended APOD image info
 * @extends HTMLDivElement
 */
class APODModal extends HTMLDivElement {
    /**
     * Create a modal
     * @param {String} breakpoint Bootstrap breakpoint in which the modal is fullscreen. Defaults to lg.
     */
    constructor(breakpoint = "lg") {
        super();

        // APOD Modal class
        this.classList.add("modal", "fade");
        this.id = "APODModal";
        this.tabIndex = -1;
        this.setAttribute("aria-labelledby", "APODModal");
        this.setAttribute("aria-hidden", "true");

        // Modal content
        let modalDialog = document.createElement("div");
        modalDialog.classList.add("modal-dialog", "modal-" + breakpoint, "modal-fullscreen-" + breakpoint + "-down", "modal-dialog-centered", "modal-dialog-scrollable");

        let modalContent = document.createElement("div");
        modalContent.classList.add("modal-content");


        // Modal header
        let modalHeader = document.createElement("div");
        modalHeader.classList.add("modal-header");

        this.modalTitle = document.createElement("h5");
        this.modalTitle.classList.add("modal-title");
        this.modalTitle.textContent = "";
        modalHeader.appendChild(this.modalTitle);

        let closeButton = document.createElement("button");
        closeButton.type = "button";
        closeButton.classList.add("btn-close");
        closeButton.dataset.bsDismiss = "modal";
        closeButton.setAttribute("aria-label", "Close");
        modalHeader.appendChild(closeButton);

        modalContent.appendChild(modalHeader);


        // Modal body
        let modalBody = document.createElement("div");
        modalBody.classList.add("modal-body");

        this.image = document.createElement("img");
        this.image.classList.add("card-img-top", "mb-3");
        this.image.src = "";
        this.image.alt = "";
        modalBody.appendChild(this.image);

        this.author = document.createElement("h6");
        this.author.classList.add("card-subtitle", "mb-2", "text-muted");
        this.author.textContent = "";
        modalBody.appendChild(this.author);

        this.description = document.createElement("p");
        this.description.textContent = "";
        modalBody.appendChild(this.description);


        // Footer in body
        let footer = document.createElement("div");
        footer.classList.add("d-flex", "justify-content-between", "align-items-baseline");

        this.dateText = document.createElement("small");
        this.dateText.classList.add("text-muted", "text-end");
        this.dateText.textContent = "";
        footer.appendChild(this.dateText);

        this.APODSiteLink = document.createElement("a");
        this.APODSiteLink.classList.add("btn", "btn-light", "mb-2");
        this.APODSiteLink.target = "_blank";
        this.APODSiteLink.rel = "noopener noreferrer";
        this.APODSiteLink.href = "";
        this.APODSiteLink.textContent = "Go to original APOD site";
        footer.appendChild(this.APODSiteLink);

        modalBody.appendChild(footer);
        modalContent.appendChild(modalBody);
        modalDialog.appendChild(modalContent);
        this.appendChild(modalDialog);
    }

    /**
     * Create an APOD Card
     * @param {String} APODTitle APOD picture title
     * @param {String} imageURL Thumbnail absolute URL
     * @param {String} author APOD picture author
     * @param {String} date Uploaded picture date. MM-DD-YYY
     * @param {String} description Description. Will be truncated if its longer than 100 characters
     * @param {String} linkToAPODSite URL to apod image in the original apod site
     */
    setAPODImage(APODTitle, imageURL, author, date, description, linkToAPODSite) {
        this.modalTitle.textContent = APODTitle;
        this.image.src = imageURL;
        this.image.alt = APODTitle + " by " + author;
        this.author.textContent = "By " + author;
        this.dateText.textContent = "Uploaded " + date;
        this.description.textContent = description;
        this.APODSiteLink.href = linkToAPODSite;
    }
}

/**
 * Class representing the UI of the APOD Web application
 */
class APODView {
    /**
     * Create UI
     * @param {APODController} controller APOD Web app controller
     * @param {HTMLElement} appContainer HTML Element to draw UI on
     */
    constructor(controller, appContainer) {

        this.ui = appContainer;
        this.controller = controller;
        this.menu = new APODMenuBar("md");
        this.ui.appendChild(this.menu);
        this.modal = new APODModal("md");
        this.ui.appendChild(this.modal);

        this.nextPageToSearch = 1;
        this.queryToSearch = "";
        this.nextSearchAvailable = false;

        let containerFluid = document.createElement("div");
        containerFluid.classList.add("container-fluid");
        this.cardContainer = document.createElement("div");
        this.cardContainer.classList.add("row", "row-cols-1", "row-cols-sm-2", "row-cols-md-3", "row-cols-lg-4", "row-cols-xl-5", "row-cols-xxl-6", "g-4");
        containerFluid.appendChild(this.cardContainer);
        this.ui.appendChild(containerFluid);

        /** @type {Array<APODCard>} */
        this.APODCards = [];

        this.loadAnimation = document.createElement("div");
        this.loadAnimation.classList.add("d-none", "justify-content-center");
        let spinner = document.createElement("div");
        spinner.classList.add("spinner-border", "m-5");
        spinner.setAttribute("role", "status");
        let spinnerText = document.createElement("span");
        spinnerText.classList.add("visually-hidden");
        spinnerText.textContent = "Loading...";
        spinner.appendChild(spinnerText);
        this.loadAnimation.appendChild(spinner);
        this.loadAnimation.style.display = "none !important";
        this.ui.appendChild(this.loadAnimation);

        // Add event listener to search button
        this.menu.searchButton.addEventListener("click", () => {
            this.search();
        });

        // Allow searching by pressing enter on the search input
        this.menu.searchInput.addEventListener("keydown", (e) => {
            if (e.key == "Enter") {
                e.preventDefault();
                this.menu.searchButton.focus();
                this.menu.searchButton.click();
            }
        });
    }

    /**
     * Switch visibility of the loading animation
     */
    switchLoadingAnimation() {
        if (this.loadAnimation.classList.contains("d-none")) {
            this.loadAnimation.classList.replace("d-none", "d-flex");
        } else {
            this.loadAnimation.classList.replace("d-flex", "d-none");
        }
    }

    /**
     * Empty the card container and search APOD images by date if text is disabled or by search text if is not
     * Also add event listener to search again if the user scroll to the botom
     */
    search() {
        this.clearCardContainer();
        this.switchLoadingAnimation();

        if (this.menu.searchInput.disabled) {
            let from = this.menu.dateFrom.value;
            let to = this.menu.dateTo.value;
            this.nextSearchAvailable = false;
            this.getApodImagesFromDateInterval(from, to);
        } else {
            this.queryToSearch = this.menu.searchInput.value;
            // Get only the 12 first results
            this.getApodImageSearchQuery(this.queryToSearch, 12, this.nextPageToSearch++);
            // Event listener to search next page when scrolling down
            window.addEventListener("scroll", () => {
                if (this.nextSearchAvailable) {
                    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
                        this.switchLoadingAnimation();
                        this.getApodImageSearchQuery(this.queryToSearch, 12, this.nextPageToSearch++);
                    }
                }
            });
        }
    }

    /**
     * Create an APOD Card and add it to the card container
     * @param {String} thumbnailURL Thumbnail absolute URL
     * @param {String} pictureTitle APOD picture title
     * @param {String} author APOD picture author
     * @param {String} date Uploaded picture date. MM-DD-YYYY
     * @param {String} description Description. Will be truncated if its longer than 100 characters
     */
    addNewAPODCard(thumbnailURL, pictureTitle, author, date, description) {
        let card = new APODCard(thumbnailURL, pictureTitle, author, date, description);

        // Add event listener to fill and display modal
        card.moreInfoButton.addEventListener("click", () => {
            // Add button animation

            // Clear image from modal
            this.modal.image.src = "";
            // Get full data from controller
            this.controller.getApodImageFromDate(date)
                .then(apodImage => {
                    if (apodImage.error) {
                        console.error(apodImage.error.message);
                    } else {
                        if (!apodImage.hdurl) {
                            apodImage.hdurl = apodImage.image_thumbnail;
                        }
                        this.modal.setAPODImage(apodImage.title, apodImage.hdurl, apodImage.copyright, apodImage.date, apodImage.description, apodImage.apod_site);
                    }
                })
                .finally( () => {
                    // End button animation
                });
        });

        this.APODCards.push(card);

        let column = document.createElement("div");
        column.classList.add("col");
        column.appendChild(card);

        this.cardContainer.appendChild(column);
    }

    /**
     * Add error message to the card container
     * @param {String} text Error text
     */
    showErrorMessage(text) {
        let errorBox = document.createElement("div");
        errorBox.classList.add("alert", "alert-danger");
        errorBox.textContent = text;

        this.cardContainer.appendChild(errorBox);
    }

    /**
     * Delete all childs of the card container
     */
    clearCardContainer() {
        while (this.cardContainer.firstChild) {
            this.cardContainer.removeChild(this.cardContainer.lastChild);
        }
    }

    /**
     * Shows APOD images from given date interval
     * @param {String} from Start date. MM-DD-YYYY
     * @param {String} to End date. MM-DD-YYYY
     */
    getApodImagesFromDateInterval(from, to) {
        // Get the data from the controller
        this.controller.getApodImagesFromDateInterval(from, to)
            .finally( () => {
                this.switchLoadingAnimation();
            })
            .then(apodImages => {
                if (apodImages.error) {
                    console.error(apodImages.error.message);
                } else {
                    if (apodImages.length == 0) {
                        this.showErrorMessage("No images found between " + from + " and " + to + ".");
                    } else {
                        for (const apodImage of apodImages) {
                            this.addNewAPODCard(apodImage.image_thumbnail, apodImage.title, apodImage.copyright, apodImage.date, apodImage.description);
                        }
                    }
                }
            });
    }

    /**
     * Shows APOD images from search query
     * @param {String} query Search for APOD images with this string
     * @param {Number} number Return only n number of APOD images that match the query
     * @param {Number} page Return nth page of APOD images if number is specified.
     */
    getApodImageSearchQuery(query, number, page) {
        // Do not allow another search if this one is running
        this.nextSearchAvailable = false;
        // Get the data from the controller
        this.controller.getApodImageSearchQuery(query, number, page)
            .finally( () => {
                this.switchLoadingAnimation();
                // Allow next search again
                this.nextSearchAvailable = true;
            })
            .then(apodImages => {
                if (apodImages.error) {
                    console.error(apodImages.error.message);
                    this.showErrorMessage("No images found with " + query + ".");
                } else {
                    for (const apodImage of apodImages) {
                        this.addNewAPODCard(apodImage.image_thumbnail, apodImage.title, apodImage.copyright, apodImage.date, apodImage.description);
                    }
                }
            });
    }
}

/**
 * Gets current date in the correct format of html date inputs. YYYY-MM-DD
 * @returns {String} YYYY-MM-DD current date
 */
function getCurrentDateHTML() {
    let currentDate = new Date();

    let year = currentDate.getFullYear();
    let month = (currentDate.getMonth() + 1).toString();
    let day = currentDate.getDate().toString();

    if (month.length < 2)
        month = "0" + month;
    if (day.length < 2)
        day = "0" + day;

    return [year, month, day].join("-");
}

export { APODCard, APODMenuBar, APODModal, APODView };