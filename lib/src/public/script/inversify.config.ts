import { Container } from "inversify";
import TYPES from "./types/types";
import { AnonymousConnection, PasswordConnection, JwtConnection } from "./factories/connections";
import { UserConnection } from "./interfaces/interfaces";

var container = new Container();
container.bind<UserConnection>(TYPES.UserConnection).to(AnonymousConnection);
container.bind<UserConnection>(TYPES.UserConnection).to(PasswordConnection);
container.bind<UserConnection>(TYPES.UserConnection).to(JwtConnection);

export default container;