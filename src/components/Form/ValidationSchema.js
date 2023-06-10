import { convertDateFormat, removeTags, isURL } from "../../helpers/helper";

export function isUrlMethod(message = "URL is invalid") {
    return this.test("isUrl", message, (value) => isURL(value));
}

export function validateRichText(message = "This field is required") {
    return this.required(message).test("validateRichText", message, (value) => {
        const result = removeTags(value)

        if(result.trim().length > 0)
            return true
        return false
    });
}

