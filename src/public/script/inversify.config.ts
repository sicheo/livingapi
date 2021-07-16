import { Container } from "inversify";
import TYPES from "./types";
import { AnonymousConnection} from "./connections";
import { UserConnection } from "./interfaces";

var container = new Container();
container.bind<UserConnection>(TYPES.UserConnection).to(AnonymousConnection);

export default container;