

export interface User {
  id?: number;         
  username?: string;
  email: string;        
  password?: string;    
  role?: UserRole;
  image?: string;
  matricule?: string;

  
}

  export enum UserRole {
  ENSEIGNANT = 'ENSEIGNANT',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}