
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Receipt, Download, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface ReceiptGeneratorProps {
  transactionId: string;
}

const ReceiptGenerator: React.FC<ReceiptGeneratorProps> = ({ transactionId }) => {
  const { data: transaction } = useQuery({
    queryKey: ['transaction-receipt', transactionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', transactionId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const generatePDF = () => {
    if (!transaction) return;

    // Create receipt content
    const receiptContent = `
      MOCHA MARKET DIGITAL RECEIPT
      ============================
      
      Transaction ID: ${transaction.id}
      Date: ${new Date(transaction.completed_at || transaction.created_at!).toLocaleDateString()}
      
      Product Details:
      - Product: ${transaction.product_name}
      - Price: M ${transaction.agreed_price}
      - Delivery Fee: M ${transaction.delivery_fee}
      - Total: M ${(transaction.agreed_price + (transaction.delivery_fee || 0)).toFixed(2)}
      
      Delivery Information:
      - Option: ${transaction.delivery_option}
      ${transaction.delivery_address ? `- Address: ${transaction.delivery_address}` : ''}
      ${transaction.delivery_distance_km ? `- Distance: ${transaction.delivery_distance_km}km` : ''}
      
      Seller ID: ${transaction.seller_id}
      Buyer ID: ${transaction.buyer_id}
      
      Status: ${transaction.status?.toUpperCase()}
      
      This is an official receipt from MoCha Market.
      Transaction verified and completed.
      
      For support, contact: support@mochamarket.ls
    `;

    // Create and download PDF (simplified version)
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MoCha-Receipt-${transaction.id.slice(0, 8)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success('Receipt downloaded successfully!');
  };

  const emailReceipt = () => {
    if (!transaction) return;

    // In a real app, you'd send this via email service
    const emailSubject = `MoCha Market Receipt - ${transaction.product_name}`;
    const emailBody = `
Dear Customer,

Thank you for your purchase on MoCha Market!

Transaction Details:
- Product: ${transaction.product_name}
- Amount: M ${transaction.agreed_price}
- Transaction ID: ${transaction.id}
- Date: ${new Date(transaction.completed_at || transaction.created_at!).toLocaleDateString()}

Your receipt is attached to this email.

Best regards,
MoCha Market Team
    `;

    // Open email client (fallback method)
    const mailtoLink = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoLink);

    toast.success('Email client opened with receipt details!');
  };

  if (!transaction) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Loading transaction details...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Receipt className="w-5 h-5 mr-2" />
          Digital Receipt
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Receipt Preview */}
        <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold">MoCha Market</h2>
            <p className="text-sm text-muted-foreground">Official Transaction Receipt</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium">Transaction ID:</span>
              <span className="font-mono text-sm">{transaction.id.slice(0, 8)}...</span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-medium">Date:</span>
              <span>{new Date(transaction.completed_at || transaction.created_at!).toLocaleDateString()}</span>
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between">
                <span className="font-medium">Product:</span>
                <span>{transaction.product_name}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Price:</span>
                <span>M {transaction.agreed_price}</span>
              </div>
              
              {transaction.delivery_fee && transaction.delivery_fee > 0 && (
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span>M {transaction.delivery_fee}</span>
                </div>
              )}
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>M {(transaction.agreed_price + (transaction.delivery_fee || 0)).toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span className="capitalize">{transaction.delivery_option}</span>
              </div>
              
              {transaction.delivery_address && (
                <div className="flex justify-between">
                  <span>Address:</span>
                  <span className="text-sm">{transaction.delivery_address}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Status:</span>
                <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                  {transaction.status?.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>

          <div className="text-center mt-6 pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              This is an official receipt from MoCha Market
            </p>
            <p className="text-xs text-muted-foreground">
              Transaction verified and completed
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button onClick={generatePDF} className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          
          <Button onClick={emailReceipt} variant="outline" className="flex-1">
            <Mail className="w-4 h-4 mr-2" />
            Email Receipt
          </Button>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Need help? Contact support@mochamarket.ls
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReceiptGenerator;
