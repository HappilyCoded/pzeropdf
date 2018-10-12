import { format } from 'util'
class Logger {
  public static log(message) : void {
    console.log(format("[*]\t%s",message));
  }
}
export { Logger }
