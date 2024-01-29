"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTransaction = exports.showToast = exports.transferSol = exports.getProgram = void 0;
var anchor = require("@project-serum/anchor");
var react_toastify_1 = require("react-toastify");
var wallet_adapter_base_1 = require("@solana/wallet-adapter-base");
var web3_js_1 = require("@solana/web3.js");
var idl_1 = require("./idl");
var connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"));
var PROGRAM_ID = "624V3FNs96HeJwHGGNwTPLNRjhkvP48Vj9bgBuV4AZA4";
var getProgram = function (wallet) {
    var provider = new anchor.AnchorProvider(connection, wallet, anchor.AnchorProvider.defaultOptions());
    var program = new anchor.Program(idl_1.IDL, PROGRAM_ID, provider);
    return program;
};
exports.getProgram = getProgram;
var transferSol = function (wallet, referralKey, solAmount) { return __awaiter(void 0, void 0, void 0, function () {
    var program, tx, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (wallet.publicKey === null || wallet.publicKey === undefined)
                    throw new wallet_adapter_base_1.WalletNotConnectedError();
                console.log("transferSol start!!!!");
                console.log("Sender wallet public key", wallet.publicKey.toBase58());
                program = (0, exports.getProgram)(wallet);
                console.log("Receiver wallet public key", referralKey);
                _b = (_a = new web3_js_1.Transaction()).add;
                return [4 /*yield*/, program.methods
                        .transferSol(new anchor.BN(solAmount * web3_js_1.LAMPORTS_PER_SOL))
                        .accounts({
                        from: wallet.publicKey,
                        to: referralKey,
                        systemProgram: web3_js_1.SystemProgram.programId,
                    })
                        .instruction()];
            case 1:
                tx = _b.apply(_a, [_c.sent()]);
                console.log("transferSol end!!!!");
                return [4 /*yield*/, send(connection, wallet, tx)];
            case 2: 
            // let tx = new Transaction();
            // tx.add(sendIx);
            return [2 /*return*/, _c.sent()];
        }
    });
}); };
exports.transferSol = transferSol;
var showToast = function (txt, duration, ty) {
    let type = toast.TYPE.SUCCESS;
    if (ty === 1) type = toast.TYPE.ERROR;
    if (ty === 2) type = toast.TYPE.INFO;
    if (duration === void 0) { duration = 5000; }
    if (ty === void 0) { ty = 0; }
    var autoClose = duration;
    // if (duration < 0) {
    //   autoClose = false;
    // }
    return react_toastify_1.toast.error(txt, {
        position: "bottom-right",
        autoClose: autoClose,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        // type,
        theme: "colored",
    });
};
exports.showToast = showToast;
function send(connection, wallet, transaction) {
    return __awaiter(this, void 0, void 0, function () {
        var txHash, confirming_id, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sendTransaction(connection, wallet, transaction)];
                case 1:
                    txHash = _a.sent();
                    if (!(txHash != null)) return [3 /*break*/, 3];
                    confirming_id = (0, exports.showToast)("Confirming Transaction ...", -1, 2);
                    return [4 /*yield*/, connection.confirmTransaction(txHash)];
                case 2:
                    res = _a.sent();
                    console.log(txHash);
                    react_toastify_1.toast.dismiss(confirming_id);
                    if (res.value.err)
                        (0, exports.showToast)("Transaction Failed", 2000, 1);
                    else
                        (0, exports.showToast)("Transaction Confirmed", 2000);
                    return [3 /*break*/, 4];
                case 3:
                    (0, exports.showToast)("Transaction Failed", 2000, 1);
                    _a.label = 4;
                case 4: return [2 /*return*/, txHash];
            }
        });
    });
}
function sendTransaction(connection, wallet, transaction) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, signedTransaction, rawTransaction, txid, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (wallet.publicKey === null || wallet.signTransaction === undefined)
                        return [2 /*return*/, null];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 5, , 6]);
                    _a = transaction;
                    return [4 /*yield*/, connection.getLatestBlockhash()];
                case 2:
                    _a.recentBlockhash = (_b.sent()).blockhash;
                    transaction.feePayer = wallet.publicKey;
                    return [4 /*yield*/, wallet.signTransaction(transaction)];
                case 3:
                    signedTransaction = _b.sent();
                    rawTransaction = signedTransaction.serialize();
                    (0, exports.showToast)("Sending Transaction ...", 500);
                    return [4 /*yield*/, connection.sendRawTransaction(rawTransaction, {
                            skipPreflight: true,
                            preflightCommitment: "processed",
                        })];
                case 4:
                    txid = _b.sent();
                    return [2 /*return*/, txid];
                case 5:
                    e_1 = _b.sent();
                    console.log("tx e = ", e_1);
                    return [2 /*return*/, null];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.sendTransaction = sendTransaction;
