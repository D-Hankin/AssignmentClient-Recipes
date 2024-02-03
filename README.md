# AssignmentClient-Recipes
Client to be used together with repository AssignmentAPI-Recipes.

Applikationen öppnas i live-server (Visual Studio Code) med localhost:5050.

Reflection:

Jag känner att jag borde egentligen börja med en sammanfattning; Det har varit en kämpig vecka där jag har lagt mer tid än någonsin framför datorn och är ganska utmattad nu där jag sitter och börja skriva det här på lördag eftermiddag. 

Jag byggde min plan på API repot där jag skaffade issues tillsammans med en projekt. Jag ville låtsas att det här var en projekt där andra skulle vara med och hantera processen med kanban metoden. 

Det fanns några principer jag ville följa och mål jag hade med projektet; Jag ville att min API skulle även använda Spring Security att kunna bygga en använder databas och därför kunna ha flera users till applikationen. Jag ville att client-sidan skulle ha bara en html fil med så lite kod som möjligt där allt ändrades dynamiskt med script filen och kopplat till det så ville jag att sidan skulle aldrig laddas om. Sedan ville jag använda om så mycket kod som möjligt inom min script – D.R.Y. 

Jag började bygga APIet först och tog hjälp av Postman att testa mina end-points. Jag valde att ha en controller/grupp till varje 'enhet' i projektet att kunna lättare förstå och hanterar var jag var i trådarna. Därför blev det en User grupp, en UserRecipes grupp och en UserLikedRecipes Grupp. Inom varje entity grävde jag lite djupare i hur man bättre annotera element för att vara mer specifik och bestämmer vad varje element ska innehålla och hur den ska hanteras och även binda ihop element i olika entities som översätts till databasen att bygga foreign-keys.

Första utmaningen kom när jag skulle bygga en custom inloggning till min Spring Security tjänst att undvika sidoomladdning där Spring Security har egen login/log-ut sidor. Jag hade jättesvårt för att kommer förbi CORS säkerheten där det handlade om Spring Security och därför var jag tvungen att hantera dess utloggnings processor manuellt. Med tanken på att vara ärlig så även om jag har förstått grunden i processen jag hade inte tid att läsa igenom alla dessa klasser jag behövde använda för att kunna lösa det här situation – jag hade fastnat i en och halv dygn på detta. Jag lärde mig dock  jätte mycket om hur Spring Security hanterar data. 

Efter det här så valde jag att pusha fram med min javascript och client-sidan. Jag valde att ta tag i all kommunikation först där jag misstänkte att det skulle ta mest tid och förmodligen innebär några ändringar i APIet. Jag hade inte fel. 

Inom min javascript har jag försökt skriva all individuella processor som egna funktioner för att kunna anropa processen från olika punkter och blev nöjd tills slut med hur många gånger jag anropade vissa funktioner och därför hoppade fram ett steg i en rad kod. Att påpeka något som var för mig som nybörjare en skön uppteckning var där jag kom på att om jag skrev innehållet för en eventlistener som egen funktion kunde jag exekvera koden när jag behövde det ut över där användaren tryckte på elementen eventlisterner:n var kopplat till.

Jag har använt mig av sessionStorage också att behålla en viss uthållighet till vissa data punkter som till exempel användarens ID för att försöka spegla hur en riktig web-applikation hade fungerat, dvs. inloggningen hålla omladdning av sidan men inte där sidan stängs och öppnas igen.   

För att jag hade fastnat så pass länge med inloggningen så tog jag också valet att offra vissa saker som till exempel att användare skulle kunna ladda upp egna bilder till deras recept. Jag tog också beslutet att ge mig själv bara ett par timmar med CSS i slutit där jag kämpade att få klar funktionalitet i applikationen. 

I efterhand så vet jag att jag tappade bollen lite med planeringen där jag hade tänkt planera APIet, utföra planet, sedan planera klienten och utföra den delen. Men med en öga på klockan körde jag bara in i javascripten och därför känner att det blev mer krångligt än behövdes där det blev att jag löste problem där dem dök upp i stället för att undvika problemet från början. Jag känner i alla fall att jag är nöjd med funktionalitet och delvis utseendet med min applikation men kanske inte helt nöjd med det som finns bakom scenerna.  



Background: Photo by <a href="https://unsplash.com/@pablomerchanm?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Pablo Merchán Montes</a> on <a href="https://unsplash.com/photos/timelapse-photo-of-man-holding-burger-hyIE90CN6b0?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
  
  
