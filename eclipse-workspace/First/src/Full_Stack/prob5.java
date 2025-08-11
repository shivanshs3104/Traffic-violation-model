package Full_Stack;
import java.util.*;
public class prob5 {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		Scanner sc  = new Scanner(System.in);
		System.out.println("Radius: ");
		double radius = sc.nextDouble();
	
		System.out.println("Height: ");
		double height = sc.nextDouble();
		
		double volume = Math.PI * radius*radius* height;
		System.out.println("Volume of Cylinder: "+volume);

	}

}
