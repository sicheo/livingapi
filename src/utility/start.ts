import { ApiServer } from "../apisrv"

/*
 * Calls ApiServer with list of modules
 * */
const main = async function () {
    const apiserver = await new ApiServer(["convergence","mock"])

    apiserver.start()
}

main()