class Response {
    #status
    #message
    #frontendMessageCode
    #fileOrigin
    #methodOrigin
    #data
    #lastID
    #rowsAffected

    constructor(status, message, frontendMessageCode, fileOrigin, methodOrigin, data, lastID, rowsAffected) {
        this.#status = status
        this.#message = message
        this.#frontendMessageCode = frontendMessageCode
        this.#fileOrigin = fileOrigin
        this.#methodOrigin = methodOrigin
        this.#data = data
        this.#lastID = lastID,
        this.#rowsAffected = rowsAffected
    }

    showLog() {
        console.log(`

            =============================================================================
            | Status: ${this.#status}
            | Message: ${this.#message}
            | FrontendMessageCode: ${this.#frontendMessageCode}
            | FileOrigin: ${this.#fileOrigin}
            | MethodOrigin: ${this.#methodOrigin}
            | Data: ${this.#data}
            | LastID: ${this.#lastID}
            | RowsAffected: ${this.#rowsAffected}
            =============================================================================

        `)
    }

    toJSON() {
        return {
            status: this.#status,
            message: this.#message,
            frontendMessageCode: this.#frontendMessageCode,
            fileOrigin: this.#fileOrigin,
            methodOrigin: this.#methodOrigin,
            data: this.#data,
            lastID: this.#lastID,
            rowsAffected: this.#rowsAffected
        };
    }

    get status() { return this.#status }
    get message() { return this.#message }
    get frontendMessageCode() { return this.#frontendMessageCode }
    get fileOrigin() { return this.#fileOrigin }
    get methodOrigin() { return this.#methodOrigin }
    get data() { return this.#data }
    get lastID() { return this.#lastID }
    get rowsAffected() { return this.#rowsAffected }
}

module.exports = Response