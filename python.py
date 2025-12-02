#write
#  a function that prints hello whenever it's called
tuples = ()
purchase = 6.7
name = 'John'
#args is short for arguments
#kwargs is short for key word arguments
def at(*args):
    
    print(f'hello {args}')


def art():
    print('good morning')


purchase_amout = 75.6
if purchase_amout >= 100:
    discount = 0.15
    payment_amount = purchase_amout - (purchase_amout * discount)
    print(f'you have a discount of {discount*100}%. your total payment amount is {payment_amount}')
elif purchase_amout >= 50 and purchase_amout < 100:
    discount = 0.05
    payment_amount = purchase_amout - (purchase_amout * discount)
    print(f'you have a discount of {discount*100}%. your total payment amount is {payment_amount}')
else:
    print(f'your total payment amount is {purchase_amout}')