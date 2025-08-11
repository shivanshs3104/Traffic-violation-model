package Full_Stack;
import java.util.*;
public class prob10 {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		Scanner sc = new Scanner(System.in);

        System.out.print("Enter distance in kilometers: ");
        double kilometers = sc.nextDouble();

        double miles = kilometers * 0.621371;

        System.out.println(kilometers + " kilometers is equal to " + miles + " miles.");

	}

}
