<<<<<<< HEAD
# Complete Python Course Outline

## Course Overview
A comprehensive guide to learning Python from beginner to intermediate level, covering fundamental concepts, data structures, functions, and practical applications.

"""Resolved merge: kept the full course README content (local) and removed
the short remote README that caused the conflict."""

# Complete Python Course Outline

## Course Overview
A comprehensive guide to learning Python from beginner to intermediate level, covering fundamental concepts, data structures, functions, and practical applications.

---

## Table of Contents
1. [Module 1: Getting Started](#module-1-getting-started)
2. [Module 2: Data Types & Variables](#module-2-data-types--variables)
3. [Module 3: Operators & Control Flow](#module-3-operators--control-flow)
4. [Module 4: Loops](#module-4-loops)
5. [Module 5: Functions](#module-5-functions)
6. [Module 6: Data Structures](#module-6-data-structures)
7. [Module 7: File Handling](#module-7-file-handling)
8. [Module 8: Object-Oriented Programming](#module-8-object-oriented-programming)
9. [Module 9: Error Handling](#module-9-error-handling)
10. [Module 10: Libraries & Modules](#module-10-libraries--modules)

---

## Module 1: Getting Started

### Topics
- What is Python?
- Installing Python
- Setting up your IDE/Editor
- Your first Python program
- Comments and documentation
- Print statements and basic output

### Learning Objectives
- Understand Python and its uses
- Install Python correctly
- Write and run your first program
- Use comments effectively

### Key Concepts
```python
# This is a comment
print("Hello, World!")
```

---

## Module 2: Data Types & Variables

### Topics
- Variables and assignment
- Data types: int, float, str, bool
- Type conversion
- String operations and methods
- Variable naming conventions

### Learning Objectives
- Understand different data types
- Create and manipulate variables
- Convert between data types
- Perform string operations

### Key Concepts
```python
name = "Alice"           # String
age = 25                # Integer
height = 5.6            # Float
is_student = True       # Boolean
```

---

## Module 3: Operators & Control Flow

### Topics
- Arithmetic operators (+, -, *, /, //, %, **)
- Comparison operators (==, !=, <, >, <=, >=)
- Logical operators (and, or, not)
- If statements
- If-elif-else statements
- Nested conditions

### Learning Objectives
- Perform mathematical operations
- Compare values
- Write conditional logic
- Handle multiple conditions

### Key Concepts
```python
if age >= 18:
    print("You are an adult")
elif age >= 13:
    print("You are a teenager")
else:
    print("You are a child")
```

---

## Module 4: Loops

### Topics
- While loops
- For loops
- Range function
- Loop control (break, continue)
- Nested loops
- Loop best practices

### Learning Objectives
- Repeat code using loops
- Control loop flow
- Iterate through sequences
- Avoid infinite loops

### Key Concepts
```python
for i in range(5):
    print(i)

while count < 10:
    count += 1
```

---

## Module 5: Functions

### Topics
- Defining functions
- Parameters and arguments
- Return statements
- Scope and namespaces
- Default parameters
- *args and **kwargs
- Lambda functions
- Docstrings

### Learning Objectives
- Write reusable functions
- Understand parameter types
- Return values properly
- Document your functions
- Use advanced function features

### Key Concepts
```python
def greet(name="Guest", *args, **kwargs):
    """A greeting function"""
    return f"Hello, {name}!"

result = greet("Alice")
```

---

## Module 6: Data Structures

### Topics
- Lists: creation, indexing, slicing, methods
- Tuples: immutability, unpacking
- Dictionaries: keys, values, methods
- Sets: unique elements, operations
- List comprehensions
- Nested data structures

### Learning Objectives
- Choose appropriate data structures
- Manipulate lists and dictionaries
- Understand mutability
- Use comprehensions efficiently

### Key Concepts
```python
my_list = [1, 2, 3, 4]
my_dict = {"name": "Alice", "age": 25}
my_tuple = (1, 2, 3)
my_set = {1, 2, 3}

# List comprehension
squares = [x**2 for x in range(5)]
```

---

## Module 7: File Handling

### Topics
- Opening and closing files
- Reading files
- Writing to files
- Appending to files
- Context managers (with statement)
- Working with different file formats
- File paths and directories

### Learning Objectives
- Read and write files
- Handle file operations safely
- Work with file paths
- Use context managers

### Key Concepts
```python
with open("file.txt", "r") as file:
    content = file.read()

with open("file.txt", "w") as file:
    file.write("Hello, World!")
```

---

## Module 8: Object-Oriented Programming

### Topics
- Classes and objects
- Attributes and methods
- Constructors (__init__)
- Inheritance
- Encapsulation
- Polymorphism
- Special methods (dunder methods)

### Learning Objectives
- Design classes
- Create and use objects
- Implement inheritance
- Understand OOP principles

### Key Concepts
```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def greet(self):
        return f"Hello, I'm {self.name}"

person = Person("Alice", 25)
```

---

## Module 9: Error Handling

### Topics
- Try-except blocks
- Exception types
- Handling multiple exceptions
- Finally blocks
- Raising exceptions
- Custom exceptions

### Learning Objectives
- Handle errors gracefully
- Use try-except effectively
- Raise meaningful exceptions
- Debug common errors

### Key Concepts
```python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero!")
finally:
    print("Cleanup code here")
```

---

## Module 10: Libraries & Modules

### Topics
- Importing modules
- Built-in modules (os, sys, math, random, datetime)
- Creating your own modules
- Package management with pip
- Popular libraries (requests, numpy, pandas)
- Virtual environments

### Learning Objectives
- Use standard library modules
- Install and use third-party packages
- Create modular code
- Manage dependencies

### Key Concepts
```python
import math
from datetime import datetime
import requests

print(math.sqrt(16))
```

---

# Exercises

## Module 1: Getting Started - Exercises

### Exercise 1.1: Hello Program
Write a program that prints your name and age.

**Expected Output:**
```
My name is [Your Name]
I am [Your Age] years old
```

### Exercise 1.2: Multi-line Comments
Create a program with both single-line and multi-line comments explaining what the code does.

---

## Module 2: Data Types & Variables - Exercises

### Exercise 2.1: Temperature Converter
Write a program that converts Celsius to Fahrenheit.

**Formula:** F = (C × 9/5) + 32

**Test Case:** 0°C should equal 32°F

### Exercise 2.2: String Manipulation
Create variables for first name and last name, then print:
- Full name
- Full name in uppercase
- Full name in lowercase
- Length of full name

### Exercise 2.3: Calculate Area
Calculate the area of a rectangle given length and width.
- Prompt: length = 10, width = 5
- Expected Area: 50

---

## Module 3: Operators & Control Flow - Exercises

### Exercise 3.1: Number Comparison
Write a program that compares two numbers and prints which is greater, or if they're equal.

### Exercise 3.2: Grade Evaluator
Create a program that takes a score (0-100) and prints:
- A: 90-100
- B: 80-89
- C: 70-79
- D: 60-69
- F: Below 60

### Exercise 3.3: Age Category
Write a program that determines if someone is:
- A child (< 13)
- A teenager (13-19)
- An adult (20-64)
- A senior (65+)

### Exercise 3.4: Leap Year Checker
A year is a leap year if:
- It's divisible by 4 AND not divisible by 100, OR
- It's divisible by 400

Write a program to check if a given year is a leap year.

---

## Module 4: Loops - Exercises

### Exercise 4.1: Multiplication Table
Print the multiplication table for a number (e.g., 5).

**Expected Output for 5:**
```
5 x 1 = 5
5 x 2 = 10
...
5 x 10 = 50
```

### Exercise 4.2: Sum of Numbers
Write a program that calculates the sum of numbers from 1 to 100.

**Expected Output:** 5050

### Exercise 4.3: Pattern Printing
Print the following pattern:
```
*
**
***
****
*****
```

### Exercise 4.4: Number Guessing Game
Create a simple game where:
- The program picks a random number 1-10
- User gets 3 attempts to guess
- Print if they're too high, too low, or correct

### Exercise 4.5: Fibonacci Sequence
Print the first 10 Fibonacci numbers.

**Expected Output:** 0, 1, 1, 2, 3, 5, 8, 13, 21, 34

### Exercise 4.6: Prime Number Checker
Write a program that checks if a number is prime.

---

## Module 5: Functions - Exercises

### Exercise 5.1: Basic Function
Create a function `calculate_avg()` that takes 3 numbers and returns their average.

### Exercise 5.2: Greeting Function
Create a `greet()` function with a default parameter for name.
```python
greet()  # "Hello, Guest!"
greet("Alice")  # "Hello, Alice!"
```

### Exercise 5.3: Area Calculator
Create functions to calculate:
- `circle_area(radius)`
- `rectangle_area(length, width)`
- `triangle_area(base, height)`

### Exercise 5.4: Variable Arguments Function
Create a function `sum_all(*args)` that sums any number of arguments.

**Test:**
```python
sum_all(1, 2, 3)  # Returns 6
sum_all(1, 2, 3, 4, 5)  # Returns 15
```

### Exercise 5.5: Keyword Arguments Function
Create a function `print_info(**kwargs)` that prints any keyword arguments passed.

```python
print_info(name="Alice", age=25, city="NYC")
# Output:
# name: Alice
# age: 25
# city: NYC
```

### Exercise 5.6: Decorator Function
Create a function that converts another function's output to uppercase.

---

## Module 6: Data Structures - Exercises

### Exercise 6.1: List Operations
Create a list of 5 numbers and:
- Print the first and last element
- Add a new number
- Remove a number
- Sort the list

### Exercise 6.2: Dictionary Student Info
Create a dictionary with student information (name, age, grade, subjects).
Print each piece of information.

### Exercise 6.3: List Comprehension
Create a list of squares for numbers 1-10 using list comprehension.

**Expected Output:** [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]

### Exercise 6.4: Tuple Unpacking
Create a tuple with 3 values and unpack it into 3 variables.

### Exercise 6.5: Set Operations
Create two sets and find:
- Union
- Intersection
- Difference

### Exercise 6.6: Nested Structures
Create a list of dictionaries representing students with name, age, and grades. Print all students and their average grades.

### Exercise 6.7: Remove Duplicates
Take a list with duplicates and remove them using a set.

---

## Module 7: File Handling - Exercises

### Exercise 7.1: Write to File
Create a program that writes 10 lines to a file called "numbers.txt" (numbers 1-10).

### Exercise 7.2: Read and Display
Read the file from Exercise 7.1 and display its contents.

### Exercise 7.3: Append to File
Add 5 more numbers (11-15) to the "numbers.txt" file.

### Exercise 7.4: Line Counter
Write a program that counts the number of lines in a text file.

### Exercise 7.5: Word Frequency
Read a text file and count the frequency of each word.

### Exercise 7.6: Create CSV
Create a program that writes student data to a CSV file.

---

## Module 8: Object-Oriented Programming - Exercises

### Exercise 8.1: Simple Class
Create a `Car` class with:
- Attributes: brand, model, year
- Method: `display_info()` that prints car details

### Exercise 8.2: Bank Account
Create a `BankAccount` class with:
- Attributes: account_holder, balance
- Methods: `deposit()`, `withdraw()`, `check_balance()`

### Exercise 8.3: Inheritance
Create a `Vehicle` base class and inherit:
- `Car` class
- `Motorcycle` class

### Exercise 8.4: Student Class
Create a `Student` class with:
- Attributes: name, age, grades (list)
- Methods: `add_grade()`, `calculate_average()`, `get_status()`

### Exercise 8.5: Encapsulation
Create a class with private attributes (name starting with _) and use getters/setters.

### Exercise 8.6: Multiple Inheritance
Create classes where a class inherits from multiple parent classes.

---

## Module 9: Error Handling - Exercises

### Exercise 9.1: Division Handler
Write a program that handles division by zero gracefully.

### Exercise 9.2: Type Error Handling
Create a function that converts input to integer and handles ValueError.

### Exercise 9.3: File Exception
Write a program that handles file not found exceptions.

### Exercise 9.4: Multiple Exceptions
Write a function that handles multiple exception types appropriately.

### Exercise 9.5: Custom Exception
Create a custom exception class and raise it under certain conditions.

### Exercise 9.6: Finally Block
Write a program demonstrating the use of try-except-finally.

---

## Module 10: Libraries & Modules - Exercises

### Exercise 10.1: Math Module
Use the math module to:
- Calculate square root
- Calculate factorial
- Calculate sine, cosine
- Use pi constant

### Exercise 10.2: Random Module
Create a game using random module to:
- Pick random numbers
- Shuffle a list
- Choose random elements

### Exercise 10.3: Datetime Module
Write a program that:
- Gets current date and time
- Calculates days until birthday
- Formats dates

### Exercise 10.4: Create a Module
Create your own module with multiple functions and import it in another file.

### Exercise 10.5: OS Module
Use the os module to:
- List files in a directory
- Create directories
- Get file sizes

---

## Challenge Projects

### Project 1: To-Do List Manager
Create a program that:
- Add, remove, and display tasks
- Save tasks to a file
- Load tasks from a file on startup

### Project 2: Calculator
Build a calculator that:
- Performs basic operations (+, -, *, /)
- Handles division by zero
- Allows multiple calculations in a session

### Project 3: Quiz Game
Create a quiz application that:
- Reads questions from a file
- Tracks score
- Provides feedback

### Project 4: Personal Finance Tracker
Create a program that:
- Records income and expenses
- Categorizes transactions
- Generates reports
- Saves data to a file

### Project 5: Library Management System
Create a class-based system that:
- Stores book information
- Tracks borrowed books
- Manages user accounts
- Displays available books

---

## Assessment Rubric

### Code Quality (25%)
- Proper naming conventions
- Comments and documentation
- Code organization
- DRY principle

### Functionality (50%)
- Program works as expected
- Handles edge cases
- Produces correct output
- No runtime errors

### Best Practices (15%)
- Follows Python conventions (PEP 8)
- Efficient algorithms
- Proper error handling

### Completeness (10%)
- All requirements met
- Extra features (if applicable)
- Clean submission

---

## Resources for Students

### Online Platforms
- Python.org Official Docs
- W3Schools Python Tutorial
- CodeAcademy
- HackerRank
- LeetCode

### Books
- "Python Crash Course" by Eric Matthes
- "Automate the Boring Stuff with Python" by Al Sweigart
- "Learning Python" by Mark Lutz

### Debugging Tips
1. Read error messages carefully
2. Use print() to trace execution
3. Test with small inputs first
4. Check variable types
5. Use a debugger

---

## Course Completion Checklist

- [ ] Module 1: Getting Started
- [ ] Module 2: Data Types & Variables
- [ ] Module 3: Operators & Control Flow
- [ ] Module 4: Loops
- [ ] Module 5: Functions
- [ ] Module 6: Data Structures
- [ ] Module 7: File Handling
- [ ] Module 8: Object-Oriented Programming
- [ ] Module 9: Error Handling
- [ ] Module 10: Libraries & Modules
- [ ] All Exercises Completed
- [ ] Challenge Projects Completed

---

## Tips for Success

1. **Practice Regularly**: Write code every day, even if just for 15 minutes
2. **Don't Just Watch**: Type out all examples, don't just read them
3. **Understand, Don't Memorize**: Focus on understanding concepts
4. **Debug Like a Detective**: Learn to find and fix errors systematically
5. **Read Other's Code**: Learn from examples on GitHub
6. **Build Projects**: Apply what you learn to real problems
7. **Join Communities**: Connect with other learners
8. **Be Patient**: Programming takes time to master

---

**Happy Learning!** 🐍
