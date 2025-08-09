import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const Payment = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const responseCode = searchParams.get("vnp_ResponseCode");
    const amount = searchParams.get("vnp_Amount");
    const orderInfo = searchParams.get("vnp_OrderInfo");

    if (responseCode === "00") {
      toast.success("✅ Thanh toán thành công!");
      console.log("Số tiền:", Number(amount));
      console.log("Thông tin đơn hàng:", decodeURIComponent(orderInfo));
    } else {
      toast.error("❌ Thanh toán thất bại!");
    }
  }, []);

  return (
    <div>
      <h1>Kết quả thanh toán</h1>
      <p>Đang xử lý kết quả từ VNPay...</p>
    </div>
  );
};

export default Payment;
