const User = require("../model/CustomerModel");
const Transaction = require("../model/Transaction");

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
    const vendor = await User.findById(to);

    if (
      parseFloat(user.wallet).toFixed(1) < parseFloat(walletAmount).toFixed(1)
    ) {
      return res.status(200).send({
        success: false,
        message: "Insufficient Wallet amount",
      });
    }
    const cashBackAmount = (+totalAmount * +cashback) / 100;
    const userWallet = +user.wallet - +walletAmount + cashBackAmount;
    const vendorWallet = +vendor.wallet + +totalAmount - cashBackAmount;

    const transaction = await Transaction.create({
      from,
      to,
      amount: totalAmount,
      cashBack: cashback,
    });

    await User.findOneAndUpdate(
      { _id: from },
      { wallet: userWallet },
      { new: true }
    );
    await User.findOneAndUpdate(
      { _id: to },
      { wallet: vendorWallet },
      { new: true }
    );

    res.status(200).send({ success: true, message: "Success", user });
  } catch (e) {
    console.log(e);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await Transaction.find(req.query);
    res.status(200).send({ success: true, message: "All Orders", orders });
  } catch (e) {
    console.log(e);
    res.status(200).send({ success: false, message: e.message });
  }
};

module.exports = { createOrder, getOrders };
