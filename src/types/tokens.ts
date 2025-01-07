export interface UserTokens {
  id: string;
  user_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface TokenTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'purchase' | 'usage';
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}
