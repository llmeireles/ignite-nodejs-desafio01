export function ValidateTaskBodyFields(body) {
    const erros = []

    if(!body) {
        erros.push('request body is required')
    }
    else {
        if(!body.title) {
            erros.push('property title is required')
        }

        if(!body.description) {
            erros.push('property description is required')
        }
    }

    return erros
}