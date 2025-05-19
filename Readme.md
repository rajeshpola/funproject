#in Git Bash  Create a Key Files 
ssh-keygen -t ed25519 -C "raj2ps@gmail.com"
Enter + Enter 
#2 
cat ~/.ssh/id_ed25519.pub
#3 
Go to SSH Key setting   https://github.com/settings/keys
Enter the public key 
##vscode 
verify ssh -T git@github.com
git clone git@github.com: rajeshpola / funproject 


git add .
git commit -m "Initial commit"
git push origin main   # or master, depending on your branch