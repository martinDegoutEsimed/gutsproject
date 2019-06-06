class BaseController {
    constructor() {
        this.pageLocation = new URL(window.location.href);
    }

    createUrl(newLocation = "/") {
        if (this.pageLocation.port === "80") {
            return ${this.pageLocation.protocol}//${this.pageLocation.hostname}${newLocation};
        }
        return ${this.pageLocation.protocol}//${this.pageLocation.hostname}:${this.pageLocation.port}${newLocation};
    }

    findParameterInUrl(parameter) {
        if (typeof parameter === "undefined") {
            throw "parameter is required";
        }

        return this.pageLocation.searchParams.get(parameter);
    }
}