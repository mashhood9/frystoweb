let regex_config = {
    only_alphabets: /^[a-zA-Z][a-zA-Z ]*$/,
    url: /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    postal_code: /^[1-9][0-9]{5}$/,
    mobile_number: /^[1-9][0-9]{9}$/,
    number: /^[0-9]*$/
}

module.exports = { regex_config }