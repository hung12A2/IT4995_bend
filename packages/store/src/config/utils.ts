export const sortObject = (obj: Record<string, any>) => {
  let sorted: any = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
};

  // private scheduleOrderCheck() {
  //   cron.schedule('*/2 * * * *', () => {
  //     this.checkAndUpdateOrders();
  //   });
  // }

  // private async checkAndUpdateOrders() {
  //   console.log ('hello')
  //   const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
  //   const pendingOrders = await this.orderRepository.find({
  //     where: {
  //       and: [{status: 'pending'}, {createdAt: {lt: twoMinutesAgo}}],
  //     },
  //   });

  //   for (const order of pendingOrders) {
  //     order.status = 'rejected';
  //     await this.orderRepository.updateById(order.id, order);
  //     console.log(`Order ${order.id} has been rejected`);
  //   }
  // }
