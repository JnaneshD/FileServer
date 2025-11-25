// package main

// import (
// 	"fmt"
// 	"os"
// )

// func check(e error) {
// 	if e != nil {
// 		panic(e)
// 	}
// }

// func main() {
// 	dat, err := os.ReadFile("somefile.txt")
// 	check(err)
// 	fmt.Fprintf(os.Stdout, string(dat))

// 	f, err := os.Open("somefile.txt")
// 	check(err)

// 	b1 := make([]byte, 5)
// 	n1, err := f.Read(b1)
// 	check(err)
// 	fmt.Printf("%d bytes : %s\n", n1, string(b1[:n1]))
// }
