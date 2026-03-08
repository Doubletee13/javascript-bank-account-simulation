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

