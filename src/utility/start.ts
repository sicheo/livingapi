import { ApiServer } from "../apisrv"


const main = async function () {
    const apiserver = await new ApiServer(["convergence","mock"])

    apiserver.start()
}

main()