import { Injectable } from "@nestjs/common"

import * as readline from "readline"
@Injectable()
export class ReadlineService {
    public rl: readline.Interface
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })
    }
}