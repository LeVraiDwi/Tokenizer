#[starknet::contract]
mod GoldPocket {

    use starknet::ContractAddress;
    use starknet::get_caller_address;

    //defined contract storage layout. Contract hold persistence data maintain across function calls and transaction
    #[storage]
    struct Storage {
        owner: ContractAddress,
        name: felt252,
        symbol: felt252,
        total_supply: u256,
        decimal: u8,
        balances: LegacyMap::<ContractAddress, u256>,
        allowances: LegacyMap::<(ContractAddress, ContractAddress), u256>, 
    }

    //use to create a new contract
    #[constructor]
    fn constructor(ref self: ContractState, _owner:ContractAddress, _name: felt252, _symbol: felt252, _decimal: u8, _total_supply: u256) {
        self.name.write(_name);
        self.symbol.write(_symbol);
        self.decimal.write(_decimal);
        self.owner.write(_owner);
    }

    //External function can be call by other contract or entities
    #[external(v0)]
    #[generate_trait]
    impl CairoTokenTraitImpl of CairoTokenTrait {

        //geter for properties
        fn name(self: @ContractState) -> felt252 {
            self.name.read()
        }

        fn owner(self: @ContractState) -> ContractAddress {
            self.owner.read()
        }

        fn symbol(self: @ContractState) -> felt252 {
            self.symbol.read()
        }

        fn totalSupply(self: @ContractState) -> u256 {
            self.total_supply.read()
        }

        //function use to mint new token
        fn mint(ref self: ContractState, to: ContractAddress, amount: u256) {
            assert(get_caller_address() == self.owner.read(), 'Invalid caller');
            let new_total_supply = self.total_supply.read() + amount;
            self.total_supply.write(new_total_supply);
            let new_balance = self.balances.read(to) + amount;
            self.balances.write(to, new_balance);
        }

        //tranfert token to anothe contract
        fn transfer(ref self: ContractState, to: ContractAddress, amount: u256){
            let caller: ContractAddress = get_caller_address();
            self._transfer(caller, to, amount);
        }

        //transfert from another contract
        fn transferFrom(ref self: ContractState, sender: ContractAddress, to: ContractAddress, amount: u256){
            let caller = get_caller_address();
            assert(self.allowances.read((sender, caller)) >= amount, 'No allowance');
            self.allowances.write((sender, caller), self.allowances.read((sender, caller)) - amount);
            self._transfer(sender, to, amount);
        }

        //approve a transaction from another contract with a certain ammount
        fn approve(ref self: ContractState, spender: ContractAddress, amount: u256) {
            let caller: ContractAddress = get_caller_address();
            let mut prev_allowance: u256 = self.allowances.read((caller, spender));
            self.allowances.write((caller, spender), prev_allowance + amount);
        }

        //give right to another contract to make a transaction
        fn allowance(self: @ContractState, owner: ContractAddress, spender: ContractAddress) -> u256 {
            self.allowances.read((owner, spender))
        }

        //get the balance of the account
        fn balanceOf(self: @ContractState, account: ContractAddress) -> u256 {
            self.balances.read(account)
        }
    }

    //generate a implementation for a trait
    #[generate_trait]
    impl PrivateFunctions of CairoTokenPrivateFunctionsTrait {

        //define implementation for _tranfer which handle tokken transfert
        fn _transfer(ref self: ContractState, sender: ContractAddress, recipient: ContractAddress, amount: u256) {
            //check if the ender has enought token
            assert(self.balances.read(sender) >= amount, 'Insufficient bal');
            self.balances.write(recipient, self.balances.read(recipient) + amount);
            self.balances.write(sender, self.balances.read(sender) - amount)
        }

    }
}
