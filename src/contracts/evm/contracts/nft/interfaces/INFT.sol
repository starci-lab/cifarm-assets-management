// SPDX-License-Identifier: 3.0
pragma solidity ^0.8.24;

import {INFTWrite} from "./INFTWrite.sol";
import {INFTEvents} from "./INFTEvents.sol";
import {INFTRead} from "./INFTRead.sol";

interface INFT is INFTWrite, INFTRead, INFTEvents {}