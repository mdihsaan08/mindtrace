#Name: Mohammed Ihsaan
#UID: 433009053

#Checking if the given triangle is Equilaterl, Isoceles or Scalene.
def triangle_type_checker(A, B, C):
    """
    Determines the type of triangle based on side lengths.
    Parameters:
    A, B, C (float): Lengths of the triangle's sides.
    Returns:
    str: "Equilateral", "Isosceles", or "Scalene".
    
    """
    if A <= 0 or B <= 0 or C <= 0:
        return ValueError("Side lengths must be greater than zero")

    elif A == B == C:
        return "Equilateral"
    elif A == B or B == C or A == C:
        return "Isosceles"
    else:
        return "Scalene"
    triangle_type_checker()
    

#Getting the input from the user
def main():
    A = float(input("Enter length of side A: "))
    B = float(input("Enter length of side B: "))
    C = float(input("Enter length of side C: "))

    triangle = triangle_type_checker(A, B, C)
    print(f"The triangle is {triangle}.")
main()
