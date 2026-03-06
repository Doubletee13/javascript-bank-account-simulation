class Account {
    static allTransactions = []
    constructor(fName, lName, balance) {
        this.firstName = fName
        this.lName = lName
        this.balance = balance
        this.transactions = []
    }
    deposit(amountToDeposit) {
        if (amountToDeposit > 0) {
            this.balance += amountToDeposit
            const now = new Date().toLocaleString()
            const transaction = {
                "Name": `${this.firstName} ${this.lName}`,
                "Type": "Deposit",
                "Amount": amountToDeposit,
                "Time": now
            }
            Account.allTransactions.push(transaction)
            this.transactions.push(transaction)
            return `Credit: N${amountToDeposit} successfully credited\nCurrent balance: N${this.balance}`
        } else {
            return `Amount must be greater than zero`
        }
    }
    withraw(amountToWithdraw) {
        if (amountToWithdraw <= 0) {
            return `Amount must be greater than zero`
        }
        const totalAvailable = this.balance + (this.overdraft || 0)

        if (totalAvailable >= amountToWithdraw) {
            this.balance -= amountToWithdraw
            const now = new Date().toLocaleString()
            const transaction = {
                "Name": `${this.firstName} ${this.lName}`,
                "Type": "Withdrawal",
                "Amount": amountToWithdraw,
                "Time": now
            }
            Account.allTransactions.push(transaction)
            this.transactions.push(transaction)
            return `Debit: N${amountToWithdraw} successfully withdrawn\nBalance: N${this.balance}`
        } else {
            return "Insufficient balance"
        }
    }
    transfer(amountToTransfer, recipient) {
        if (!(recipient instanceof Account)) {
            return "Not a valid Account"
        }
        if (recipient === this) {
        return "You cannot transfer to yourself"
        }
        let feedback = this.withraw(amountToTransfer)
        const result = feedback.split(" ").indexOf("successfully")
        if (result !== -1) {
            recipient.deposit(amountToTransfer)
            return `Transfer Successful: N${amountToTransfer} credited to ${recipient.firstName} ${recipient.lName}`
        }
        return feedback
    }
}


class SavingsAccount extends Account {
    constructor(fName, lName, balance) {
        super(fName, lName, balance)
        this.interestClaimed = false
    }
    getInterest() {
        if (this.interestClaimed) {
            return "Interest bonus has already been applied to your account"
        }
        let interest = this.balance * (5 / 100)
        this.balance += interest
        this.interestClaimed = true
        return `You have successfully gotten 5% bonus\nBalance: N${this.balance}`
    }
}


class CurrentAccount extends Account {
    constructor(fName, lName, balance) {
        super(fName, lName, balance)
        this.overdraft = 0
        this.overdraftClaimed = false
    }
    getOverdraft() {
        if (this.overdraftClaimed) {
            return `Overdraft already applied. Overdraft limit: N${this.overdraft}`
        }
        let overdraftAmount = this.balance * (5 / 100)
        this.overdraft += overdraftAmount
        this.overdraftClaimed = true
        return `You have successfully gotten 5% overdraft\nBalance: N${this.balance} | Overdraft limit: N${this.overdraft}`
    }
}

//savings users

const acc1 = new SavingsAccount("Temitope", "Akinlade", 1000)

console.log(acc1.deposit(500))      
console.log(acc1.deposit(0))         
console.log(acc1.deposit(-100))      

console.log(acc1.withraw(200))       
console.log(acc1.withraw(0))                  
console.log(acc1.withraw(999999))   

console.log(acc1.getInterest())       
console.log(acc1.getInterest()) 

const acc2 = new SavingsAccount("Minna", "Des", 100)
console.log(acc1.transfer(300, acc2))    
console.log(acc1.transfer(999999, acc2)) 
console.log(acc1.transfer(100, "acc2")) 
console.log(acc1.transfer(0, acc2))      
console.log(acc1.transfer(-50, acc2))
console.log(acc1.transfer(200,acc1)) 

console.log(acc1.transactions)      
  
//current users
const acc3 = new CurrentAccount("Bola", "James", 1000)


console.log(acc3.getOverdraft())   
console.log(acc3.getOverdraft())     

console.log(acc3.withraw(500))     

console.log(acc3.withraw(520))   

console.log(acc3.withraw(600)) 
console.log(acc3.transactions)           

const acc4 = new CurrentAccount("Kemi", "Ola", 200)
console.log(acc4.withraw(250))       
console.log(acc4.getOverdraft())    
console.log(acc4.withraw(205)) 

console.log(acc4.transactions)     
console.log(Account.allTransactions) 