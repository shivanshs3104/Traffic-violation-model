package Full_Stack;
import java.util.*;
public class prob8 {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		Scanner sc = new Scanner(System.in);

        System.out.print("Enter base: ");
        double base = sc.nextDouble();

        System.out.print("Enter exponent: ");
        double exponent = sc.nextDouble();

        // Calculate power without loops or conditionals
        double result = Math.pow(base, exponent);
        System.out.println(base + " raised to the power of " + exponent + " is: " + result);

	}

}
