const User = require("../model/CustomerModel");
const Notification = require("../model/Notification");
const Transaction = require("../model/Transaction");
const moment = require("moment");
const createOrder = async (req, res, next) => {
  try {
    const { from, to, totalAmount, walletAmount, cashback } = req.body;
    if (!from) {
      res
        .status(400)
        .send({ success: true, message: "from field is required (user id)" });
    }
    if (!to) {
      res
        .status(400)
        .send({ success: true, message: "to field is required (vendor id)" });
    }
    if (!totalAmount) {
      res
        .status(400)
        .send({ success: true, message: "totalAmount field is required" });
    }
    if (!walletAmount) {
      res
        .status(400)
        .send({ success: true, message: "walletAmount field is required" });
    }
    if (!cashback) {
      res.status(400).send({ success: true, message: "Cashack % is required" });
    }

    const user = await User.findById(from);

    if (
      parseFloat(user.wallet).toFixed(1) < parseFloat(walletAmount).toFixed(1)
    ) {
      return res.status(200).send({
        success: false,
        message: "Insufficient Wallet amount",
      });
    }

    const transaction = await Transaction.create({
      from,
      to,
      amount: totalAmount,
      cashBack: cashback,
      userWalletAmount: walletAmount,
    });
    await Notification.create({
      userId: to,
      title: "Order from" + user.firstName,
      orderId: transaction._id,
      message: "You have a pending order of amount Rs " + totalAmount,
    });

    res.status(200).send({
      success: true,
      message: "Order is pending. Admin will soon approve your order",
    });
  } catch (e) {
    console.log(e);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    // console.log(req.query.month);
    const month = req.query.month;
    let orders = [];
    // console.log(month);
    if (startDate == undefined && endDate == undefined) {
      orders = await Transaction.find(req.query);
    } else {
      const splitDate = (d) => {
        return d.split("-");
      };

      console.log(startDate, endDate);
      let filter = {};
      if (startDate != undefined) {
        const dateStart = new Date();
        dateStart.setUTCFullYear(parseInt(splitDate(startDate)[2]));
        dateStart.setUTCMonth(parseInt(splitDate(startDate)[1]));
        dateStart.setUTCDate(parseInt(splitDate(startDate)[0]));
        dateStart.setUTCHours(0, 0, 0);

        filter = {
          $gte: dateStart,
        };
      }
      if (endDate != undefined) {
        const dateMax = new Date();
        dateMax.setUTCFullYear(parseInt(splitDate(endDate)[2]));
        dateMax.setUTCMonth(parseInt(splitDate(endDate)[1]));
        dateMax.setUTCDate(parseInt(splitDate(endDate)[0]));
        dateMax.setUTCHours(0, 0, 0);
        filter = {
          ...filter,
          $lte: dateMax,
        };
      }

      orders = await Transaction.find({ ...req.query, createdAt: filter });
    }

    res.status(200).send({ success: true, message: "All Orders", orders });
  } catch (e) {
    console.log(e);
    res.status(200).send({ success: false, message: e.message });
  }
};

const ApproveOrder = async (req, res, next) => {
  try {
    const id = req.params.id;
    const transactionData = await Transaction.findById(id);
    // const value=req.params.id

    const user = await User.findById(transactionData.from);
    const vendor = await User.findById(transactionData.to);

    // res.status(200).send({ success: true, transactionData, user, vendor });
    if (+user.wallet < +transactionData.userWalletAmount) {
      res.status(200).send({
        status: false,
        message: "User does not have sufficient wallet amount",
      });
    }
    const cashBackAmount =
      (+transactionData.amount * +transactionData.cashBack) / 100;
    const userWallet =
      +user.wallet - +transactionData.userWalletAmount + +cashBackAmount;
    const vendorWallet =
      +vendor.wallet + +transactionData.amount - +cashBackAmount;
    console.log(vendorWallet, userWallet, "<<<this is wallet", cashBackAmount);
    await User.findOneAndUpdate(
      { _id: transactionData.from },
      { wallet: parseFloat(userWallet) },
      { new: true }
    );
    await User.findOneAndUpdate(
      { _id: transactionData.to },
      { wallet: parseFloat(vendorWallet) },
      { new: true }
    );
    const approveIt = await Transaction.findOneAndUpdate(
      { _id: id },
      { status: "Approved" },
      { new: true }
    );
    res
      .status(200)
      .send({ success: true, message: "Order successfully approved" });
  } catch (e) {
    console.log(e);
    res.status(200).send({ success: false, message: e.message });
  }
};

module.exports = { createOrder, getOrders, ApproveOrder };
