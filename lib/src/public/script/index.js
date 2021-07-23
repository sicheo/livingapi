import { Brouser } from "./brouser";
import { JwtApi } from "./factories/jwtapi";
import { AnonymousConnection, PasswordConnection, JwtConnection } from "./factories/connections";
//import * as Conv from "@convergence/convergence"

let ConvApp = {}

ConvApp.Brouser = Brouser
ConvApp.JwtApi = JwtApi
ConvApp.AnonymousConnection = AnonymousConnection
ConvApp.JwtConnection = JwtConnection
ConvApp.PasswordConnection = PasswordConnection
//ConvApp.Conv = Conv

window.ConvApp = ConvApp;