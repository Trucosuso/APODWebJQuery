//@ts-check
import { APODView } from "./view.js";

/**
 * Controller class for APOD web app
 */
class APODController {
    /**
     * Loads the app
     */
    constructor() {
        this.view = new APODView(this, document.body);

        this.APIBaseURL = "https://apodapi.herokuapp.com/api/";
        this.APISearchURL = "https://apodapi.herokuapp.com/search/";
    }

    /**
     * Gets random APOD images
     * @param {Number} number Number of images to get. Defaults to 1
     */
    async getRandomApodImages(number = 1) {
        try {
            let response = await fetch(this.APIBaseURL + "?count=" + number + "&image_thumbnail_size=500");

            if (response.ok) {
                let apodImages = await response.json();
                // Trim image_thumbnail to resolve a correct url
                for (const apodImage of apodImages) {
                    apodImage.image_thumbnail = apodImage.image_thumbnail.slice(13, apodImage.image_thumbnail.length - 10);
                }
                return apodImages;
            } else if (response.status == 404) {
                let responseJson = await response.json();
                if (responseJson.error) {
                    return responseJson;
                }
            } else {
                throw new Error("HTTP-Error: " + response.status);
            }
        } catch (error) {
            console.error("Error: " + error);
            return {"error": error};
        }
    }

    /**
     * Gets an APOD image from a given date
     * @param {String} date Date of image. MM-DD-YYYY
     */
    async getApodImageFromDate(date) {
        try {
            let response = await fetch(this.APIBaseURL + "?date=" + date + "&image_thumbnail_size=500");

            if (response.ok) {
                let apodImage = await response.json();
                // Trim image_thumbnail to resolve a correct url
                apodImage.image_thumbnail = apodImage.image_thumbnail.slice(13, apodImage.image_thumbnail.length - 10);
                return apodImage;
            } else if (response.status == 404) {
                let responseJson = await response.json();
                if (responseJson.error) {
                    return {"error": {"message": responseJson.error}};
                }
            } else {
                throw new Error("HTTP-Error: " + response.status);
            }
        } catch (error) {
            console.error("Error: " + error);
            return {"error": error};
        }
    }

    /**
     * Gets APOD images from a date interval
     * @param {String} from Start date. MM-DD-YYYY
     * @param {String} to End date. MM-DD-YYYY
     */
    async getApodImagesFromDateInterval(from, to) {
        try {
            let response = await fetch(this.APIBaseURL + "?start_date=" + from + "&end_date=" + to + "&image_thumbnail_size=500");

            if (response.ok) {
                let apodImages = await response.json();
                // Trim image_thumbnail to resolve a correct url
                for (const apodImage of apodImages) {
                    apodImage.image_thumbnail = apodImage.image_thumbnail.slice(13, apodImage.image_thumbnail.length - 10);
                }
                return apodImages;
            } else {
                throw new Error("HTTP-Error: " + response.status);
            }
        } catch (error) {
            console.error("Error: " + error);
            return {"error": error};
        }
    }

    /**
     * Gets APOD images from search query
     * @param {String} query Search for APOD images with this string
     * @param {Number} number Return only n number of APOD images that match the query
     * @param {Number} page Return nth page of APOD images if number is specified.
     */
    async getApodImageSearchQuery(query, number, page) {
        try {
            let response = await fetch(this.APISearchURL + "?search_query=" + query + "&number=" + number + "&page=" + page + "&image_thumbnail_size=500");

            if (response.ok) {
                let apodImages = await response.json();
                // Trim image_thumbnail to resolve a correct url
                for (const apodImage of apodImages) {
                    apodImage.image_thumbnail = apodImage.image_thumbnail.slice(13, apodImage.image_thumbnail.length - 10);
                }
                return apodImages;
            } else if (response.status == 404) {
                let responseJson = await response.json();
                if (responseJson.error) {
                    return {"error": {"message": responseJson.error}};
                }
            } else {
                throw new Error("HTTP-Error: " + response.status);
            }
        } catch (error) {
            console.error("Error: " + error);
            return {"error": error};
        }
    }
}

export { APODController };