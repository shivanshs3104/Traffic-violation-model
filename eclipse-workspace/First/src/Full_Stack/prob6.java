package Full_Stack;
import java.util.*;
public class prob6 {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		Scanner sc=  new Scanner(System.in);
		
		System.out.println("Principal");
		int p = sc.nextInt();
		
		System.out.println("Rate");
		int r = sc.nextInt();
		
		System.out.println("Time");
		int t  = sc.nextInt();
		
		int si = (p*r*t)/100;
		System.out.println("Simple Interest: "+si);

	}

}
