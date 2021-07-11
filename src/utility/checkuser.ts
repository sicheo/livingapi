import { LivingUserController } from "../controllers/usersControl"

const main = async function () {
    console.log("***** TEST USERS ***********")
    const path = require("path")
    const confpath = path.join(__dirname, "/../data/livingdb.db")
    console.log(confpath)
    const luser = await new LivingUserController(confpath)

    luser.getUserLogin("giulio.stumpo@gmail.com", "passwordi")
        .then((data: any) => {
            console.log(data)
        })
        .catch((err: any) => {
            console.log(err)
        })
  

}

main()