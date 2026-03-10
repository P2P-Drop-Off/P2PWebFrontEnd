// src/pages/ConfirmTransaction.jsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../css/confirm.css";

export default function ConfirmTransaction() {
  const navigate = useNavigate();
  const { id } = useParams();

  const approveTransaction = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/items/${id}/approve`, {
        method: "PUT"
      });

      if (!res.ok) throw new Error("Failed to approve transaction");

      alert("Transaction approved!");
      navigate(`/listing/${id}`);
    } catch (err) {
      console.error(err);
      alert("Error approving transaction");
    }
  };

  return (
    <div className="confirm-page">
      <div className="confirm-card">
        <section className="title">
            <h1>Confirm This Transaction</h1>
            
        </section>

        <div className="steps">
          <div className="step">
            <span>1</span>
            <p>Once you approve this transaction, the seller will drop off the item 
                at the verified partner location within 3 days.*</p>
          </div>
          <div className="step">
            <span>2</span>
            <p>After drop off is verifed by the partner location, you will 
                see the item status updated to <i>Dropped Off</i>.
                You will have <b>3 days</b> to pick the item up with no additional storage fee.**</p>
          </div>
          <div className="step">
            <span>3</span>
            <p>The item will only be released after you have paid the seller and they confirm
            the payment in the system. You should only pay the seller after the item has 
            been dropped off, as the partner location will verify the item matches the description. </p>
          </div>
          <div className="step">
            <span>4</span>
            <p>When the seller confirms payment is received, the item status will update 
                to <i>Payment Recieved - Item Awaiting Pick Up</i>.
                This means you can proceed to the designated pickup location.</p>
          </div>
          <div className="step">
            <span>5</span>
            <p>At the pickup location, you will need to present the item code. This is the 
                unique 6-digit code that you will see after approving the tranaction.
            </p>
          </div>
          <div className="step">
            <span>6</span>
            <p>The partner location staff will verify the code and release the item to you.</p>

          </div>
          <p><i>
            *If the seller does not drop off the item within 3 days, the transaction
            will automatically be cancelled. 
          </i></p>
          <p><i>
            **If you do not pick up the item within 3 
            days of drop off, you may be subject to an additional fee. 
            If you do not pick up the item within 7 days of drop off, the transaction will
             be cancelled and the seller will be notified.
        </i></p>
        </div>

        <button className="confirm-btn" onClick={approveTransaction}>
          Approve Transaction
        </button>

        <button
          className="cancel-btn"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
    </div>
  );
}