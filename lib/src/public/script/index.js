import { Brouser } from "./brouser";
import { JwtAuthentication } from "./factories/authenticate";
import { AnonymousConnection, PasswordConnection, JwtConnection } from "./factories/connections";

let ConvApp = {}

ConvApp.Brouser = Brouser
ConvApp.JwtAuthentication = JwtAuthentication
ConvApp.AnonymousConnection = AnonymousConnection
ConvApp.JwtConnection = JwtConnection
ConvApp.PasswordConnection = PasswordConnection

window.ConvApp = ConvApp;